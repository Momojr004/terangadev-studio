import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  Section,
  SectionTag,
  SectionHeadline,
} from "@/components/site/section";
import { fetchPublishedNotes, type NotesLocale } from "@/lib/notes";

export async function NotesTeaser({ locale }: { locale: string }) {
  const safeLocale: NotesLocale = locale === "en" ? "en" : "fr";
  const t = await getTranslations({ locale: safeLocale, namespace: "NotesTeaser" });
  const notes = (await fetchPublishedNotes(safeLocale)).slice(0, 3);

  if (notes.length === 0) {
    return null;
  }

  const dateFmt = new Intl.DateTimeFormat(safeLocale === "en" ? "en-US" : "fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Section variant="surface">
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <SectionTag>{t("tag")}</SectionTag>
          <SectionHeadline>{t("headline")}</SectionHeadline>
        </div>
        <Link
          href="/notes"
          className="text-teranga-primary inline-flex items-center gap-1.5 text-sm font-medium"
        >
          {t("viewAll")}
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <ul className="mt-16 grid gap-x-8 gap-y-12 md:grid-cols-3">
        {notes.map((note) => {
          const dateLabel = note.publishedAt
            ? dateFmt.format(new Date(note.publishedAt))
            : null;
          const reading = note.readingMinutes
            ? t("readingMinutes", { count: note.readingMinutes })
            : null;
          return (
            <li key={note.id} className="flex flex-col gap-3">
              <Link
                href={`/notes/${note.slug}`}
                className="group flex flex-col gap-3"
              >
                <div className="text-muted flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em]">
                  {dateLabel && <span>{dateLabel}</span>}
                  {dateLabel && reading && <span className="text-fg/20">·</span>}
                  {reading && <span>{reading}</span>}
                </div>
                <h3 className="font-display text-2xl leading-tight font-medium tracking-tight transition-colors group-hover:text-teranga-primary">
                  {note.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {note.excerpt}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
