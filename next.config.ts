import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withPayload } from "@payloadcms/next/withPayload";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

// Baseline security headers applied to every response. A strict
// Content-Security-Policy is intentionally NOT set here yet — it needs
// per-route tuning (Next inline runtime, Payload admin, R3F, Google Fonts)
// and is tracked as a follow-up. HSTS only takes effect over HTTPS, so it
// is inert on http://localhost during dev.
const securityHeaders = [
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
