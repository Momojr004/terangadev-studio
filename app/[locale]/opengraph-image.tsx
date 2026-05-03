import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const alt = "TerangaDev — Studio produit dakarois";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "Site" });

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #4EA8F9 0%, #0A68F7 70%, #0A2A6B 100%)",
          padding: "72px 80px",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
        }}
      >
        {/* Tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: "-0.01em",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              background: "rgba(255,255,255,0.18)",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            T
          </div>
          TerangaDev
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: 96,
            fontWeight: 500,
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
            marginTop: "auto",
            fontFamily: 'Georgia, "Times New Roman", serif',
            maxWidth: 980,
          }}
        >
          {t("tagline")}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 28,
            opacity: 0.85,
            marginTop: 40,
            lineHeight: 1.4,
            maxWidth: 920,
            fontWeight: 400,
          }}
        >
          {t("description")}
        </div>

        {/* Footer URL */}
        <div
          style={{
            fontSize: 18,
            marginTop: 48,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "ui-monospace, SFMono-Regular, monospace",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          <span>terangadev.com</span>
          <span>{locale === "en" ? "Dakar · Senegal" : "Dakar · Sénégal"}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
