import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withPayload } from "@payloadcms/next/withPayload";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Content-Security-Policy.
//
// `script-src`/`style-src` keep 'unsafe-inline' (and script 'unsafe-eval')
// because Next's hydration runtime, the next-themes anti-flash inline script,
// and the Payload admin / Lexical editor all rely on them — a nonce-based
// policy would need middleware rework and is tracked as a follow-up. Even so,
// the policy still hardens the high-value directives: default-src baseline,
// object-src none, base-uri / form-action self, frame-ancestors self.
// Fonts are self-hosted by next/font, so no external font origin is needed.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

// Baseline security headers applied to every response. HSTS only takes effect
// over HTTPS, so it is inert on http://localhost during dev.
const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  // SAMEORIGIN (not DENY) keeps Payload admin live-preview iframes working.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withPayload(withNextIntl(nextConfig), {
  devBundleServerPackages: false,
});
