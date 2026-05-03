import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { siteConfig } from "@/lib/site-config";
import {
  fetchPublishedNotes,
  type Note,
  type NoteCategory,
} from "@/lib/notes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "NotesIndex" });
  return {
    title: t("headline"),
    description: t("subhead"),
  };
}

export default async function NotesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const notes = await fetchPublishedNotes(
    locale === "en" ? "en" : "fr",
  );

  return <NotesContent notes={notes} />;
}

function NotesContent({ notes }: { notes: Note[] }) {
  const t = useTranslations("NotesIndex");

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-12 md:pt-28 md:pb-20">
        <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
          {t("tag")}
        </p>
        <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[1.05] font-medium tracking-tight md:text-6xl lg:text-7xl">
          {t("headline")}
        </h1>
        <p className="text-muted mt-8 max-w-2xl text-lg leading-relaxed md:text-xl">
          {t("subhead")}
        </p>
      </section>

      {notes.length > 0 ? (
        <PublishedList notes={notes} />
      ) : (
        <PreviewSection />
      )}

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="border-border bg-surface flex flex-col items-start gap-6 rounded-3xl border p-10 md:flex-row md:items-center md:justify-between md:p-14">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl leading-tight font-medium tracking-tight md:text-4xl">
                {t("ctaHeadline")}
              </h2>
              <p className="text-muted mt-4 text-base leading-relaxed">
                {t("ctaBody")}
              </p>
            </div>
            <a
              href={`mailto:${siteConfig.email}?subject=notes`}
              className="bg-teranga-primary hover:bg-teranga-secondary inline-flex h-12 shrink-0 items-center gap-2 rounded-full px-7 text-sm font-medium text-white transition-colors duration-300"
            >
              {t("ctaButton")}
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

const categoryKeys: Record<NoteCategory, string> = {
  technical: "categoryTechnical",
  product: "categoryProduct",
  sovereignty: "categorySovereignty",
  pedagogy: "categoryPedagogy",
};

function PublishedList({ notes }: { notes: Note[] }) {
  const t = useTranslations("NotesIndex");

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <ul className="border-border divide-border divide-y border-y">
        {notes.map((note) => {
          const date = note.publishedAt
            ? new Date(note.publishedAt).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "";
          return (
            <li key={note.id}>
              <Link
                href={`/notes/${note.slug}` as never}
                className="group flex flex-col gap-4 py-10 transition-colors duration-300 md:flex-row md:items-baseline md:gap-12 md:py-14"
              >
                <span className="text-muted font-mono text-xs uppercase tracking-[0.2em] md:w-32 md:shrink-0">
                  {t(categoryKeys[note.category])}
                </span>
                <div className="flex-1">
                  <h2 className="font-display text-3xl leading-tight font-medium tracking-tight transition-colors group-hover:text-teranga-primary md:text-4xl">
                    {note.title}
                  </h2>
                  <p className="text-muted mt-4 max-w-2xl text-base leading-relaxed">
                    {note.excerpt}
                  </p>
                  <div className="text-muted mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs">
                    {date && <span>{date}</span>}
                    {note.readingMinutes ? (
                      <>
                        <span aria-hidden>·</span>
                        <span>
                          {t("readingMinutes", {
                            minutes: note.readingMinutes,
                          })}
                        </span>
                      </>
                    ) : null}
                  </div>
                </div>
                <ArrowUpRight className="text-fg/40 size-5 shrink-0 transition-all duration-500 [transition-timing-function:var(--ease-expo-out)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-teranga-primary" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function PreviewSection() {
  const t = useTranslations("NotesIndex");
  const previews = [
    { title: t("preview1Title"), body: t("preview1Body") },
    { title: t("preview2Title"), body: t("preview2Body") },
    { title: t("preview3Title"), body: t("preview3Body") },
  ];
  return (
    <section className="bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <p className="text-teranga-primary font-mono text-xs uppercase tracking-[0.2em]">
          {t("comingSoonTag")}
        </p>
        <h2 className="font-display mt-6 max-w-3xl text-3xl leading-tight font-medium tracking-tight md:text-4xl">
          {t("comingSoonTitle")}
        </h2>
        <p className="text-muted mt-6 max-w-2xl text-base leading-relaxed">
          {t("comingSoonBody")}
        </p>
        <ul className="mt-16 grid gap-6 md:grid-cols-3">
          {previews.map((preview, idx) => (
            <li
              key={idx}
              className="border-border bg-bg flex flex-col gap-4 rounded-2xl border p-8"
            >
              <div className="flex items-center justify-between">
                <span className="text-teranga-primary font-mono text-xs">
                  0{idx + 1}
                </span>
                <span className="border-border text-muted rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em]">
                  {t("previewLabel")}
                </span>
              </div>
              <h3 className="font-display text-xl leading-tight font-medium tracking-tight">
                {preview.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {preview.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
