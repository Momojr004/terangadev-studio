"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

/**
 * Narrative atmospheric particles per manifeste chapter.
 *
 * Mounts a small particle layer only when the chapter is in the
 * viewport (Framer's useInView), unmounts when it leaves. CSS-only
 * animations (GPU-composited) — zero per-frame React work.
 *
 * Usage inside a chapter component:
 *   <ChapterAtmosphere kind="paper" />
 *
 * Keep the kind list aligned with the storyline:
 *   paper    → Ch1 ("Le monde de papier")     — paper sheets falling
 *   money    → Ch2 ("Le coût silencieux")     — FCFA amounts raining
 *   crosses  → Ch3 ("Excuses")                — diagonal strokes drawing in
 *   beams    → Ch5 ("Trois chemins")          — 3 dots traveling along beams
 *   pulse    → Ch6 ("La condition")           — 4 dots pulsing
 */

type Kind = "paper" | "money" | "crosses" | "beams" | "pulse";

export function ChapterAtmosphere({ kind }: { kind: Kind }) {
  const ref = useRef<HTMLDivElement>(null);
  // margin: render slightly before/after viewport so animations are
  // already running when the chapter is in full focus, but tear down
  // promptly once the user has moved on.
  const inView = useInView(ref, { margin: "20% 0px 20% 0px" });

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {inView && <Particles kind={kind} />}
    </div>
  );
}

function Particles({ kind }: { kind: Kind }) {
  switch (kind) {
    case "paper":
      return <PaperSheets />;
    case "money":
      return <MoneyDrops />;
    case "crosses":
      return <ExcuseCrosses />;
    case "beams":
      return <BeamDots />;
    case "pulse":
      return <ConditionPulses />;
  }
}

// --- Ch1 : Paper sheets ---------------------------------------
const PAPER_SLOTS = [
  { left: "8%",  delay: 0,    dur: 18, scale: 1.0  },
  { left: "18%", delay: -4,   dur: 22, scale: 0.85 },
  { left: "26%", delay: -10,  dur: 26, scale: 1.1  },
  { left: "38%", delay: -2,   dur: 20, scale: 0.9  },
  { left: "48%", delay: -14,  dur: 24, scale: 1.0  },
  { left: "58%", delay: -7,   dur: 19, scale: 0.95 },
  { left: "68%", delay: -16,  dur: 23, scale: 1.05 },
  { left: "78%", delay: -3,   dur: 21, scale: 0.9  },
  { left: "88%", delay: -11,  dur: 25, scale: 1.1  },
  { left: "94%", delay: -6,   dur: 20, scale: 0.85 },
];
function PaperSheets() {
  return (
    <>
      {PAPER_SLOTS.map((s, i) => (
        <span
          key={i}
          className="paper-sheet"
          style={{
            left: s.left,
            top: 0,
            transform: `scale(${s.scale})`,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </>
  );
}

// --- Ch2 : Money drops ----------------------------------------
const MONEY_AMOUNTS = [
  "12 000", "45 600", "8 400", "150 000", "32 500",
  "6 200", "88 000", "21 750", "9 100", "67 300",
  "4 800", "120 500",
];
const MONEY_SLOTS = [
  { left: "6%",  delay: 0,    dur: 14 },
  { left: "14%", delay: -3,   dur: 17 },
  { left: "22%", delay: -8,   dur: 15 },
  { left: "30%", delay: -1,   dur: 19 },
  { left: "40%", delay: -6,   dur: 16 },
  { left: "50%", delay: -11,  dur: 18 },
  { left: "60%", delay: -2,   dur: 14 },
  { left: "68%", delay: -9,   dur: 20 },
  { left: "78%", delay: -4,   dur: 16 },
  { left: "85%", delay: -13,  dur: 17 },
  { left: "92%", delay: -7,   dur: 15 },
  { left: "96%", delay: -10,  dur: 18 },
];
function MoneyDrops() {
  return (
    <>
      {MONEY_SLOTS.map((s, i) => (
        <span
          key={i}
          className="money-drop"
          style={{
            left: s.left,
            top: 0,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        >
          {MONEY_AMOUNTS[i % MONEY_AMOUNTS.length]} F
        </span>
      ))}
    </>
  );
}

// --- Ch3 : Excuse crosses (diagonal strokes) ------------------
const CROSS_SLOTS = [
  { top: "20%", left: "12%", w: 140, rotate: -8,  delay: 0   },
  { top: "38%", left: "62%", w: 120, rotate: 12,  delay: -1  },
  { top: "55%", left: "22%", w: 160, rotate: -4,  delay: -2  },
  { top: "70%", left: "70%", w: 130, rotate: 16,  delay: -3  },
  { top: "82%", left: "38%", w: 150, rotate: -10, delay: -4  },
];
function ExcuseCrosses() {
  return (
    <>
      {CROSS_SLOTS.map((s, i) => (
        <svg
          key={i}
          className="excuse-cross"
          width={s.w}
          height="20"
          viewBox={`0 0 ${s.w} 20`}
          style={{
            top: s.top,
            left: s.left,
            transform: `rotate(${s.rotate}deg)`,
            animationDelay: `${s.delay}s`,
          }}
        >
          <line
            x1="4"
            y1="14"
            x2={s.w - 4}
            y2="6"
            stroke="rgba(251, 113, 133, 0.8)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ))}
    </>
  );
}

// --- Ch5 : Beam dots (3 dots traveling vertically) ------------
const BEAM_SLOTS = [
  { left: "25%", delay: 0,    dur: 8  },
  { left: "50%", delay: -2.5, dur: 9  },
  { left: "75%", delay: -5,   dur: 7.5 },
];
function BeamDots() {
  return (
    <>
      {BEAM_SLOTS.map((s, i) => (
        <span
          key={i}
          className="beam-dot"
          style={{
            left: s.left,
            top: 0,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </>
  );
}

// --- Ch6 : 4 condition dots pulsing ---------------------------
const CONDITION_SLOTS = [
  { top: "30%", left: "20%", dur: 2.4, delay: 0    },
  { top: "30%", left: "80%", dur: 2.8, delay: -0.6 },
  { top: "70%", left: "20%", dur: 3.2, delay: -1.2 },
  { top: "70%", left: "80%", dur: 2.6, delay: -1.8 },
];
function ConditionPulses() {
  return (
    <>
      {CONDITION_SLOTS.map((s, i) => (
        <span
          key={i}
          className="condition-dot"
          style={{
            top: s.top,
            left: s.left,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </>
  );
}
