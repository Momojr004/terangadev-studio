"use client";

/**
 * Deep-space backdrop : pure CSS, no GPU shader. Four radial-gradient
 * "nebula" blobs drift across a near-black gradient base, blended with
 * screen so they accumulate into soft colored mist. The Canvas (with
 * stars) layers on top and dominates the foreground motion.
 *
 * All blob animations use long durations (24-40s) and ease-in-out, so
 * the parallax never reads as restless. The user's eye treats it as
 * background atmosphere.
 *
 * pointer-events-none so chapter copy stays fully interactive.
 */
export function NebulaBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #050816 0%, #08111F 45%, #0B1A2E 100%)",
      }}
    >
      {/* Vertical milky-way streak — diagonal soft glow that gives the
          scene a clear orientation without overpowering. */}
      <div
        className="absolute -inset-x-1/4 inset-y-0"
        style={{
          background:
            "linear-gradient(115deg, transparent 35%, rgba(78,168,249,0.06) 50%, transparent 65%)",
        }}
      />

      {/* Blob 1 — brand primary blue, drifts top-left ↔ bottom-right */}
      <div
        className="absolute h-[55vw] w-[55vw] rounded-full opacity-30 mix-blend-screen blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #1B5FBE 0%, rgba(27,95,190,0) 60%)",
          left: "-10%",
          top: "-15%",
          animation: "nebula-drift-a 38s ease-in-out infinite alternate",
        }}
      />

      {/* Blob 2 — brand secondary blue, drifts opposite direction */}
      <div
        className="absolute h-[45vw] w-[45vw] rounded-full opacity-28 mix-blend-screen blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #2D80D8 0%, rgba(45,128,216,0) 60%)",
          right: "-10%",
          bottom: "-15%",
          animation: "nebula-drift-b 32s ease-in-out infinite alternate",
        }}
      />

      {/* Blob 3 — subtle purple, adds depth without leaving the brand
          gravitational field. Sits center, breathes in/out. */}
      <div
        className="absolute h-[40vw] w-[40vw] rounded-full opacity-20 mix-blend-screen blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #5B4FBA 0%, rgba(91,79,186,0) 60%)",
          left: "30%",
          top: "30%",
          animation: "nebula-pulse 28s ease-in-out infinite",
        }}
      />

      {/* Blob 4 — cool cyan accent, smaller, drifts horizontally to
          break the symmetry. */}
      <div
        className="absolute h-[30vw] w-[30vw] rounded-full opacity-18 mix-blend-screen blur-3xl"
        style={{
          background:
            "radial-gradient(circle, #4FBEA5 0%, rgba(79,190,165,0) 60%)",
          left: "60%",
          top: "10%",
          animation: "nebula-drift-c 26s ease-in-out infinite alternate",
        }}
      />

      <style jsx>{`
        @keyframes nebula-drift-a {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          100% {
            transform: translate3d(8vw, 6vh, 0) scale(1.1);
          }
        }
        @keyframes nebula-drift-b {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          100% {
            transform: translate3d(-10vw, -8vh, 0) scale(1.08);
          }
        }
        @keyframes nebula-pulse {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.45;
          }
          50% {
            transform: translate3d(-4vw, 3vh, 0) scale(1.18);
            opacity: 0.55;
          }
        }
        @keyframes nebula-drift-c {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          100% {
            transform: translate3d(-12vw, 4vh, 0) scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
