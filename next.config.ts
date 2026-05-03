import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withPayload } from "@payloadcms/next/withPayload";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp"],
};

export default withPayload(withNextIntl(nextConfig), {
  devBundleServerPackages: false,
});
