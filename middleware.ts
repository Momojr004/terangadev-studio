import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const INTRO_COOKIE = "terangadev_seen_intro";

export default function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // First-visit gate: redirect "/" → "/manifeste" if cookie absent and no skip param
  if (pathname === "/") {
    const hasSeenIntro = req.cookies.has(INTRO_COOKIE);
    const wantsToSkip = searchParams.has("skip");

    if (!hasSeenIntro && !wantsToSkip) {
      const url = req.nextUrl.clone();
      url.pathname = "/manifeste";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  // Everything else (including /manifeste post-redirect) goes through next-intl
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
