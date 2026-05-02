export default function Home() {
  return (
    <main className="min-h-dvh">
      <section className="mx-auto flex min-h-dvh max-w-6xl flex-col items-start justify-center gap-10 px-6 py-24">
        <p className="font-mono text-xs tracking-[0.2em] text-teranga-primary uppercase">
          Studio produit dakarois
        </p>

        <h1 className="font-display text-5xl leading-[1.04] font-medium tracking-tight md:text-7xl lg:text-[5.5rem]">
          Le seul studio à Dakar qui shippe ses propres SaaS depuis 2022 —{" "}
          <span className="from-teranga-secondary to-teranga-primary bg-gradient-to-r bg-clip-text text-transparent">
            et qui t&apos;accompagne de l&apos;idée à la maintenance.
          </span>
        </h1>

        <p className="text-muted max-w-xl text-lg leading-relaxed">
          On code, on vend et on maintient nos propres SaaS depuis 2022. On
          bâtit le tien avec la même rigueur — de l&apos;idée à la maintenance,
          formation comprise.
        </p>

        <div className="flex flex-wrap gap-4">
          <button
            type="button"
            className="bg-teranga-primary hover:bg-teranga-secondary inline-flex h-12 items-center rounded-full px-7 text-sm font-medium text-white transition-colors duration-300 [transition-timing-function:var(--ease-expo-out)]"
          >
            Discutons de ton projet
          </button>
          <button
            type="button"
            className="border-border hover:bg-surface inline-flex h-12 items-center rounded-full border px-7 text-sm font-medium transition-colors duration-300 [transition-timing-function:var(--ease-expo-out)]"
          >
            Réserver un appel de 30 min
          </button>
        </div>

        <div className="border-border text-muted mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t pt-8 font-mono text-xs">
          <span>4 SaaS en prod</span>
          <span aria-hidden>·</span>
          <span>~30 projets livrés</span>
          <span aria-hidden>·</span>
          <span>6 clients en maintenance</span>
          <span aria-hidden>·</span>
          <span>Hydrautech livré en &lt;2 mois</span>
        </div>
      </section>
    </main>
  );
}
