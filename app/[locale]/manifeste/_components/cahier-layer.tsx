"use client";

import { useRef } from "react";
import { Caveat, JetBrains_Mono } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "./parallax";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const script = Caveat({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

/**
 * The protagonist — a merchant's notebook in CSS 3D, fixed between the
 * background and the chapters, choreographed by one master timeline
 * scrubbed across Acte I (#acte-papier = hero → ch.1 → ch.2 → ch.3 →
 * bascule). This is the manifesto's cork coaster: one real object the
 * whole story happens to.
 *
 *   hero   closed, floating center stage
 *   ch.1   opens — handwritten stock/debt/client pages, ghosted under
 *          the typewriter text
 *   ch.2   the ink turns red, pages tear off and fly away (the leak)
 *   ch.3   shrunk to a corner — a witness while the excuses pile up
 *   bascule dissolves into the particle world (WebGL takes over)
 *
 * DOM, not WebGL: a notebook is text, and DOM text is razor sharp at
 * every size. Hidden under md (small screens keep the typography).
 * Timeline positions are fractions of Acte I's total scroll height
 * (~660vh) — approximate by design, the object drifts between scenes.
 */

// Handwritten page content — props of the story, deliberately not
// translated (the cahier is a real Senegalese object, it speaks its
// own language).
const PAGE_LINES = [
  [
    "Riz — 12 sacs",
    "Huile — 7 bid.",
    "Sucre ???",
    "Awa doit 45 000",
    "lundi: Moussa 2 cartons",
  ],
  [
    "Tél. fournisseur !!",
    "reste caisse: 112 500",
    "Fatou — payé 1/2",
    "commande mardi ?",
  ],
  [
    "livraison Pikine",
    "3 clients passés",
    "appeler Ibrahima",
    "− 18 000 (perte?)",
  ],
];

export function CahierLayer() {
  const layerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const redRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Array<HTMLDivElement | null>>([]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        if (layerRef.current) layerRef.current.style.display = "none";
        return;
      }
      const layer = layerRef.current;
      const scene = sceneRef.current;
      const cover = coverRef.current;
      const red = redRef.current;
      const acte = document.getElementById("acte-papier");
      if (!layer || !scene || !cover || !red || !acte) return;
      const pages = pageRefs.current.filter(Boolean) as HTMLDivElement[];

      // Entrance — the object lands with the hero copy. Applied to the LAYER,
      // not `scene`: the scrubbed timeline below owns `scene`'s opacity, and
      // the two opacities multiply — so the dissolved end-state (scene
      // opacity 0 past Acte I) always wins, even on a mid-scroll reload where
      // this fade-in still runs. Without this the fade-in forced scene back
      // to opacity 1 and flashed the blurred page over a later chapter.
      gsap.from(layer, {
        opacity: 0,
        y: 60,
        scale: 0.85,
        duration: 1.4,
        delay: 0.7,
        ease: "power3.out",
      });

      // Timeline positions are fractions of Acte I's scroll height
      // (hero ≈ 0–0.07, ch.1 ≈ 0.07–0.19, ch.2 ≈ 0.19–0.50,
      //  ch.3 ≈ 0.50–0.83, bascule ≈ 0.83–1). Viewport units for
      // travel so the object actually crosses the screen.
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: acte,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // — ch.1, beat 1 : opens on the right, the statements own the left —
      tl.to(scene, { x: "22vw", y: "4vh", scale: 0.9, duration: 0.05 }, 0.07);
      tl.to(cover, { rotateY: -168, duration: 0.05 }, 0.07);
      // — ch.1, beat 2 : steps aside while 95% takes the screen —
      tl.to(scene, { x: "38vw", opacity: 0.35, duration: 0.04 }, 0.13);

      // — ch.2 : left edge, red ink, pages tear off —
      tl.to(
        scene,
        { x: "-34vw", y: "0vh", scale: 0.82, opacity: 0.6, duration: 0.05 },
        0.2,
      );
      tl.to(red, { opacity: 1, duration: 0.04 }, 0.2);
      pages.forEach((page, i) => {
        tl.to(
          page,
          {
            x: () => window.innerWidth * (0.4 + i * 0.12),
            y: () => -window.innerHeight * (0.6 + i * 0.18),
            rotation: 38 + i * 14,
            opacity: 0,
            duration: 0.07,
          },
          0.22 + i * 0.03,
        );
      });

      // — ch.3 : shrunk witness in the corner —
      tl.to(
        scene,
        { x: "36vw", y: "-8vh", scale: 0.55, opacity: 0.4, duration: 0.06 },
        0.52,
      );

      // — bascule : dissolve into the particle world —
      tl.to(
        scene,
        { scale: 1.25, opacity: 0, filter: "blur(18px)", duration: 0.12 },
        0.84,
      );
    },
    { scope: layerRef },
  );

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5]"
    >
      <div
        ref={sceneRef}
        className="absolute top-1/2 left-1/2 -mt-[190px] -ml-[150px]"
        style={{ perspective: "1600px", willChange: "transform" }}
      >
        {/* Mobile fit — the notebook is 300px wide; shrink it so it reads as
            a centered hero object on a phone without crowding the type.
            md:scale-100 keeps the desktop choreography untouched. The GSAP
            timeline targets sceneRef (the parent), so this scale composes
            cleanly with it and never fights it. */}
        <div
          className="scale-[0.6] opacity-70 md:scale-100 md:opacity-100"
          style={{
            transformOrigin: "center center",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Idle float — its own wrapper so the bob never fights GSAP */}
          <div className="manifeste-cahier-float">
            <div
              className="relative"
              style={{
                width: 300,
                height: 380,
                transform: "rotateX(38deg) rotateZ(-9deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* Desk shadow */}
              <div
                className="absolute inset-0 rounded-md"
                style={{
                  transform: "translateZ(-30px) scale(1.06)",
                  background: "rgba(20,17,11,0.35)",
                  filter: "blur(26px)",
                }}
              />

              {/* Page block — base stack */}
              <div
                className="absolute inset-0 rounded-md border border-black/10"
                style={{
                  background: "#FBF6E8",
                  transform: "translateZ(0px)",
                  boxShadow:
                    "0 1px 0 #E6DCC2, 0 3px 0 #EFE7D1, 0 5px 0 #E6DCC2",
                }}
              >
                <PageFace lines={PAGE_LINES[0]} />
                {/* Red-ink wash, revealed at chapter 2 */}
                <div
                  ref={redRef}
                  className="absolute inset-0 rounded-md opacity-0"
                  style={{
                    background:
                      "linear-gradient(165deg, rgba(190,18,60,0.0) 30%, rgba(190,18,60,0.22) 100%)",
                  }}
                />
              </div>

              {/* Flyable pages */}
              {PAGE_LINES.map((lines, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    pageRefs.current[i] = el;
                  }}
                  className="absolute inset-0 rounded-md border border-black/10"
                  style={{
                    background: "#FDF9EE",
                    transform: `translateZ(${4 + i * 3}px) rotate(${(i - 1) * 1.4}deg)`,
                    willChange: "transform",
                  }}
                >
                  <PageFace lines={lines} />
                </div>
              ))}

              {/* Kraft cover — opens around its left edge (spine) */}
              <div
                ref={coverRef}
                className="absolute inset-0 rounded-md"
                style={{
                  transform: "translateZ(14px)",
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                  background:
                    "linear-gradient(150deg, #C9A86B 0%, #B8924F 55%, #A37F40 100%)",
                  boxShadow:
                    "inset 0 0 0 1px rgba(0,0,0,0.18), inset 12px 0 18px -12px rgba(0,0,0,0.5), 0 10px 24px rgba(20,17,11,0.25)",
                  backfaceVisibility: "hidden",
                  willChange: "transform",
                }}
              >
                {/* Spine stitching */}
                <div
                  className="absolute top-2 bottom-2 left-3 w-px"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(180deg, rgba(60,40,10,0.55) 0 7px, transparent 7px 14px)",
                  }}
                />
                {/* Label sticker */}
                <div
                  className="absolute top-[26%] left-1/2 w-[62%] -translate-x-1/2 rounded-sm border border-black/15 bg-[#FBF6E8] px-4 py-5 text-center"
                  style={{ boxShadow: "0 2px 6px rgba(20,17,11,0.2)" }}
                >
                  <p
                    className={`${mono.className} text-[9px] tracking-[0.3em] text-black/45 uppercase`}
                  >
                    Boutique — Dakar
                  </p>
                  <p
                    className={`${script.className} mt-2 text-4xl leading-none font-bold text-[#1F1812]`}
                  >
                    Cahier
                  </p>
                  <p
                    className={`${script.className} mt-1.5 text-lg leading-tight text-[#1F1812]/70`}
                  >
                    stock · dettes · clients
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Ruled paper + handwritten scribbles. */
function PageFace({ lines }: { lines: string[] }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-md"
      style={{
        backgroundImage:
          "repeating-linear-gradient(180deg, transparent 0 27px, rgba(70,90,160,0.22) 27px 28px)",
        backgroundPosition: "0 14px",
      }}
    >
      {/* Margin line */}
      <div className="absolute top-0 bottom-0 left-9 w-px bg-rose-400/35" />
      <div className={`${script.className} absolute inset-0 px-12 py-5`}>
        {lines.map((line, i) => (
          <p
            key={i}
            className="text-[1.35rem] leading-[28px] text-[#26354F]/85"
            style={{ transform: `rotate(${(i % 3) - 1}deg)` }}
          >
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}
