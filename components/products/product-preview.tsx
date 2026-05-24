"use client";

import Image from "next/image";
import { useState } from "react";
import { productMeta, type ProductSlug } from "@/lib/products";

/**
 * A browser-chrome wrapper around a homepage screenshot of the product.
 *
 * The actual image lives in /public/products/{slug}.png — if no
 * screenshot is present, we render a topic-specific stylized UI mockup
 * so the card still looks like a real product, not a "coming soon"
 * placeholder.
 */

const FALLBACK_TINTS: Record<ProductSlug, { from: string; to: string; label: string; accent: string }> = {
  creneau: { from: "#FCD34D", to: "#F59E0B", label: "Créneau", accent: "#F59E0B" },
  nurapic: { from: "#4EA8F9", to: "#0A68F7", label: "Nurapic", accent: "#0A68F7" },
  "sama-reservation": { from: "#FDA4AF", to: "#FB7185", label: "Sama", accent: "#FB7185" },
  "ticket-events": { from: "#5EEAD4", to: "#0D9488", label: "Ticket-Events", accent: "#14B8A6" },
};

/** Stylized salon-booking UI for Sama Reservation (pilot). */
function SamaMockup({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-0 flex flex-col gap-4 bg-gradient-to-br from-[#FFF1F2] to-[#FFE4E6] p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-7 rounded-full" style={{ background: accent }} />
          <span className="font-display text-xl font-semibold text-[#1F2937]">Sama</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#1F2937]/60">Réserver</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-[#1F2937]/60">Mes RDV</span>
          <span className="rounded-full bg-[#1F2937] px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-white">Connexion</span>
        </div>
      </div>

      <div className="mt-2">
        <p className="text-xs uppercase tracking-[0.18em]" style={{ color: accent }}>
          Beauté · Bien-être
        </p>
        <h3 className="font-display mt-2 text-2xl leading-tight text-[#1F2937] md:text-3xl">
          Réserve ton créneau<br />en deux clics.
        </h3>
      </div>

      <div className="mt-2 grid flex-1 grid-cols-2 gap-3">
        {[
          { name: "Coiffure", time: "45 min", price: "5 000" },
          { name: "Massage", time: "60 min", price: "12 000" },
          { name: "Manucure", time: "30 min", price: "4 000" },
          { name: "Soin visage", time: "45 min", price: "8 000" },
        ].map((s) => (
          <div key={s.name} className="flex flex-col gap-1 rounded-xl bg-white/80 p-3 backdrop-blur-sm">
            <p className="text-xs font-medium text-[#1F2937]">{s.name}</p>
            <p className="text-[10px] text-[#1F2937]/55">{s.time}</p>
            <p className="mt-auto text-xs font-semibold" style={{ color: accent }}>
              {s.price} FCFA
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="rounded-full py-3 text-sm font-medium text-white"
        style={{ background: accent }}
      >
        Voir les disponibilités
      </button>
    </div>
  );
}

/** Stylized event listing UI for Ticket-Events (pilot). */
function TicketMockup({ accent }: { accent: string }) {
  return (
    <div className="absolute inset-0 flex flex-col gap-3 bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display text-xl font-semibold text-white">Ticket-Events</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.18em] text-white/60">Évènements</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-white/60">Organiser</span>
          <span className="rounded-full px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-white" style={{ background: accent }}>
            S'inscrire
          </span>
        </div>
      </div>

      <div className="mt-2">
        <p className="text-xs uppercase tracking-[0.18em]" style={{ color: accent }}>
          Évènements · Billetterie
        </p>
        <h3 className="font-display mt-2 text-2xl leading-tight text-white md:text-3xl">
          Trouve ton prochain<br />évènement à Dakar.
        </h3>
      </div>

      <div className="mt-2 grid flex-1 grid-cols-2 gap-3">
        {[
          { title: "Concert · Daara J Family", date: "24 mai", venue: "Sorano" },
          { title: "Salon Tech Dakar 2025", date: "07 juin", venue: "CICAD" },
        ].map((e) => (
          <div
            key={e.title}
            className="flex flex-col gap-2 overflow-hidden rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm"
          >
            <div
              className="h-14 w-full rounded-md"
              style={{
                background: `linear-gradient(135deg, ${accent}44, ${accent}88)`,
              }}
            />
            <p className="text-[11px] font-semibold leading-tight text-white">{e.title}</p>
            <div className="mt-auto flex items-center justify-between text-[9px] uppercase tracking-[0.15em] text-white/55">
              <span>{e.date}</span>
              <span>{e.venue}</span>
            </div>
            <button
              type="button"
              className="rounded-full py-1.5 text-[10px] font-medium text-white"
              style={{ background: accent }}
            >
              Acheter
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Generic fallback for LIVE products that don't have a screenshot yet. */
function GenericFallback({
  slug,
  tint,
}: {
  slug: ProductSlug;
  tint: (typeof FALLBACK_TINTS)[ProductSlug];
}) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${tint.from}22, ${tint.to}44), repeating-linear-gradient(0deg, transparent 0 6px, rgba(255,255,255,0.03) 6px 7px)`,
      }}
    >
      <div className="text-center">
        <p
          className="font-display text-5xl font-medium tracking-tight md:text-6xl"
          style={{ color: tint.to }}
        >
          {tint.label}
        </p>
        <p className="text-muted mt-3 font-mono text-[10px] uppercase tracking-[0.25em]">
          Screenshot coming · /public/products/{slug}.png
        </p>
      </div>
    </div>
  );
}

export function ProductPreview({
  slug,
  className,
}: {
  slug: ProductSlug;
  className?: string;
}) {
  const meta = productMeta[slug];
  const [imgFailed, setImgFailed] = useState(false);
  const tint = FALLBACK_TINTS[slug];

  const src = `/products/${slug}.png`;
  const hasExternalUrl = Boolean(meta.externalUrl);

  // Decide what to show inside the browser frame:
  //  - LIVE products with screenshot → real image
  //  - PILOT products → topic-specific stylized UI mockup
  //  - LIVE without screenshot yet → generic colored fallback
  const showImage = hasExternalUrl && !imgFailed;
  const renderMockup =
    !showImage &&
    (slug === "sama-reservation" || slug === "ticket-events");

  return (
    <figure
      className={`border-border bg-surface relative overflow-hidden rounded-2xl border ${className ?? ""}`}
    >
      {/* Browser chrome */}
      <div className="border-border bg-bg/80 flex items-center gap-2 border-b px-4 py-2.5 backdrop-blur-sm">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-rose-400/70" />
          <span className="size-2.5 rounded-full bg-amber-300/70" />
          <span className="size-2.5 rounded-full bg-emerald-400/70" />
        </span>
        {hasExternalUrl ? (
          <span className="border-border bg-bg/60 text-muted ml-3 flex-1 truncate rounded-md border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]">
            {meta.externalUrl!.replace(/^https?:\/\//, "")}
          </span>
        ) : (
          <span
            className="ml-3 flex-1 rounded-md border border-dashed px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em]"
            style={{ borderColor: `${tint.accent}55`, color: tint.accent }}
          >
            Aperçu produit · en pilote
          </span>
        )}
      </div>

      <div className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
        {showImage ? (
          <Image
            src={src}
            alt={`Aperçu de ${tint.label}`}
            width={1600}
            height={1000}
            sizes="(min-width: 768px) 55vw, 90vw"
            className="absolute inset-0 h-full w-full object-cover object-top"
            onError={() => setImgFailed(true)}
            priority={false}
          />
        ) : renderMockup ? (
          slug === "sama-reservation" ? (
            <SamaMockup accent={tint.accent} />
          ) : (
            <TicketMockup accent={tint.accent} />
          )
        ) : (
          <GenericFallback slug={slug} tint={tint} />
        )}
      </div>
    </figure>
  );
}
