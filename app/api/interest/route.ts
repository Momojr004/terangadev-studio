import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { clientIp, isRateLimited } from "@/lib/rate-limit";

const RATE_LIMIT_MAX = 5; // requests…
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // …per 10 minutes / IP

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(1),
  message: z.string().optional(),
  // Which product the lead is interested in (page context, untrusted label).
  product: z.string().max(120).optional(),
});

function formatTextEmail(data: z.infer<typeof schema>): string {
  return `Nouvelle demande produit via terangadev.com

Produit: ${data.product ?? "(non précisé)"}

Nom: ${data.name}
Email: ${data.email}
Entreprise: ${data.company}

Message:
${data.message?.trim() || "(aucun)"}

---
Reply directement à ce message — l'email du prospect est dans Reply-To.
`;
}

export async function POST(request: Request) {
  try {
    // 1. Rate limit per IP (cheapest gate first).
    if (
      isRateLimited(
        `interest:${clientIp(request)}`,
        RATE_LIMIT_MAX,
        RATE_LIMIT_WINDOW_MS,
      )
    ) {
      return NextResponse.json(
        { ok: false, error: "rate_limited" },
        { status: 429 },
      );
    }

    const body = await request.json();

    // 2. Honeypot : `company_url` is a hidden field no human fills. If a bot
    //    populated it, pretend success and drop the submission silently.
    if (
      typeof body?.company_url === "string" &&
      body.company_url.trim() !== ""
    ) {
      return NextResponse.json({ ok: true });
    }

    // 3. Validate (zod strips the honeypot and any other extra keys).
    const data = schema.parse(body);

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL ?? "contact@terangadev.com";
    const fromEmail =
      process.env.CONTACT_FROM ?? "TerangaDev <contact@terangadev.com>";

    if (apiKey) {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: data.email,
        subject: `Demande produit${
          data.product ? `: ${data.product}` : ""
        } — ${data.name}`,
        text: formatTextEmail(data),
      });
      if (error) {
        console.error("[interest] Resend error:", error);
        return NextResponse.json(
          { ok: false, error: "email" },
          { status: 502 },
        );
      }
    } else {
      console.info(
        "[interest] new submission (no RESEND_API_KEY, log-only mode)",
        {
          name: data.name,
          email: data.email,
          company: data.company,
          product: data.product,
        },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "validation", issues: error.issues },
        { status: 400 },
      );
    }
    console.error("[interest] server error:", error);
    return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
  }
}
