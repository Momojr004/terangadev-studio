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
  projectType: z.string(),
  budget: z.string(),
  timeline: z.string(),
  message: z.string().min(10),
});

const projectTypeLabels: Record<string, string> = {
  platforms: "Plateforme de gestion sur mesure",
  support: "Accompagnement A-Z",
  brand: "Identité + site vitrine",
  ecommerce: "E-commerce",
  audit: "Audit SI ou sécurité",
  marketing: "Marketing digital",
  other: "Autre",
};

const budgetLabels: Record<string, string> = {
  "<500k": "< 500 000 FCFA",
  "500k-1.5M": "500 000 → 1 500 000 FCFA",
  "1.5M-5M": "1 500 000 → 5 000 000 FCFA",
  "5M-15M": "5 000 000 → 15 000 000 FCFA",
  "15M+": "15 000 000+ FCFA",
  tbd: "Pas encore défini",
};

const timelineLabels: Record<string, string> = {
  urgent: "Urgent (< 1 mois)",
  standard: "Standard (1 → 3 mois)",
  comfortable: "Confortable (3 → 6 mois)",
  flexible: "Flexible",
  tbd: "Pas encore défini",
};

function formatTextEmail(data: z.infer<typeof schema>): string {
  return `Nouveau contact via terangadev.com

Nom: ${data.name}
Email: ${data.email}
Entreprise: ${data.company}

Type de projet: ${projectTypeLabels[data.projectType] ?? data.projectType}
Budget: ${budgetLabels[data.budget] ?? data.budget}
Timeline: ${timelineLabels[data.timeline] ?? data.timeline}

Message:
${data.message}

---
Reply directement à ce message — l'email du prospect est dans Reply-To.
`;
}

export async function POST(request: Request) {
  try {
    // 1. Rate limit per IP (cheapest gate first).
    if (
      isRateLimited(
        `contact:${clientIp(request)}`,
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
    const toEmail =
      process.env.CONTACT_EMAIL ?? "contact@terangadev.com";
    const fromEmail =
      process.env.CONTACT_FROM ?? "TerangaDev <contact@terangadev.com>";

    if (apiKey) {
      const resend = new Resend(apiKey);
      const { error } = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: data.email,
        subject: `Nouveau contact: ${data.name} — ${
          projectTypeLabels[data.projectType] ?? data.projectType
        }`,
        text: formatTextEmail(data),
      });
      if (error) {
        console.error("[contact] Resend error:", error);
        return NextResponse.json(
          { ok: false, error: "email" },
          { status: 502 },
        );
      }
    } else {
      console.info(
        "[contact] new submission (no RESEND_API_KEY, log-only mode)",
        {
          name: data.name,
          email: data.email,
          company: data.company,
          projectType: data.projectType,
          budget: data.budget,
          timeline: data.timeline,
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
    console.error("[contact] server error:", error);
    return NextResponse.json(
      { ok: false, error: "server" },
      { status: 500 },
    );
  }
}
