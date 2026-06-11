import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const INTRO_COOKIE = "terangadev_seen_intro";

// Home paths (per locale) → their manifeste entry. With localePrefix
// "as-needed", the default locale (fr) home is "/", the others keep a prefix.
const HOME_TO_MANIFESTE: Record<string, string> = {
  "/": "/manifeste",
  "/en": "/en/manifeste",
};

// Known crawlers/bots are NOT sent through the intro gate: they must reach
// the real home page so it can be indexed. Otherwise the homepage would
// redirect them to /manifeste (which is noindex) and never get indexed.
const BOT_UA =
  /bot|crawl|spider|slurp|mediapartners|facebookexternalhit|embedly|quora|pinterest|whatsapp|telegram|slack|discord|applebot|yandex|baidu|bingpreview/i;

export default function middleware(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  // First-visit gate: send a human from a home page ("/" or "/en") to the
  // manifeste once, unless they've already seen it (cookie) or asked to skip.
  const manifesteTarget = HOME_TO_MANIFESTE[pathname];
  if (manifesteTarget) {
    const hasSeenIntro = req.cookies.has(INTRO_COOKIE);
    const wantsToSkip = searchParams.has("skip");
    const isBot = BOT_UA.test(req.headers.get("user-agent") ?? "");

    if (!hasSeenIntro && !wantsToSkip && !isBot) {
      const url = req.nextUrl.clone();
      url.pathname = manifesteTarget;
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
