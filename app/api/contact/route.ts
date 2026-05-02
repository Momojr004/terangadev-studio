import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().min(1),
  projectType: z.string(),
  budget: z.string(),
  timeline: z.string(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    // V0 stub: log and return success.
    // Real Resend integration lands at J+45 per BRIEF.md §11.
    console.info("[contact] new submission", {
      name: data.name,
      email: data.email,
      projectType: data.projectType,
      budget: data.budget,
      timeline: data.timeline,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: "validation", issues: error.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { ok: false, error: "server" },
      { status: 500 },
    );
  }
}
