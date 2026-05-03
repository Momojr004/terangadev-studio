import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/site-config";
import {
  fetchAllPublishedSlugs,
  fetchNoteBySlug,
  type Note,
  type NoteCategory,
} from "@/lib/notes";
import { blogPostingSchema, breadcrumbSchema } from "@/lib/schema";

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await fetchAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const note = await fetchNoteBySlug(
    slug,
    locale === "en" ? "en" : "fr",
  );
  if (!note) return {};
  return {
    title: note.title,
    description: note.excerpt,
  };
}

const categoryLabelKeys: Record<NoteCategory, string> = {
  technical: "categoryTechnical",
  product: "categoryProduct",
  sovereignty: "categorySovereignty",
  pedagogy: "categoryPedagogy",
};

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const note = await fetchNoteBySlug(
    slug,
    locale === "en" ? "en" : "fr",
  );

  if (!note) {
    notFound();
  }

  const tDetail = await getTranslations({ locale, namespace: "NoteDetail" });
  const tIndex = await getTranslations({ locale, namespace: "NotesIndex" });

  const date = note.publishedAt
    ? new Date(note.publishedAt).toLocaleDateString(
        locale === "en" ? "en-US" : "fr-FR",
        { day: "2-digit", month: "long", year: "numeric" },
      )
    : "";

  const categoryLabel = tIndex(categoryLabelKeys[note.category]);

  const url = `${siteConfig.url}/notes/${slug}`;
  const notesUrl = `${siteConfig.url}/notes`;

  return (
    <article>
      <JsonLd
        data={[
          blogPostingSchema({
            title: note.title,
            description: note.excerpt,
            url,
            datePublished: note.publishedAt ?? undefined,
            category: categoryLabel,
          }),
          breadcrumbSchema([
            { name: "Accueil", url: siteConfig.url },
            { name: "Notes", url: notesUrl },
            { name: note.title, url },
          ]),
        ]}
      />
      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-12 pb-12 md:pt-16 md:pb-16">
        <Link
          href="/notes"
          className="text-muted hover:text-teranga-primary inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="size-4" />
          {tDetail("back")}
        </Link>

        <p className="text-teranga-primary mt-12 font-mono text-xs uppercase tracking-[0.2em]">
          {categoryLabel}
        </p>

        <h1 className="font-display mt-6 text-4xl leading-[1.05] font-medium tracking-tight md:text-5xl lg:text-6xl">
          {note.title}
        </h1>

        <p className="font-display mt-8 text-xl leading-tight tracking-tight md:text-2xl">
          {note.excerpt}
        </p>

        <div className="border-border text-muted mt-10 flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-6 font-mono text-xs">
          {date && <span>{date}</span>}
          {note.readingMinutes ? (
            <>
              <span aria-hidden>·</span>
              <span>
                {tDetail("readingMinutes", { minutes: note.readingMinutes })}
              </span>
            </>
          ) : null}
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-3xl px-6 pb-20 md:pb-28">
        <NoteBody note={note} />
      </section>

      {/* CTA */}
      <section className="bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="border-border bg-bg flex flex-col items-start gap-6 rounded-3xl border p-10 md:flex-row md:items-center md:justify-between md:p-14">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl leading-tight font-medium tracking-tight md:text-4xl">
                {tDetail("ctaHeadline")}
              </h2>
              <p className="text-muted mt-4 text-base leading-relaxed">
                {tDetail("ctaBody")}
              </p>
            </div>
            <a
              href={`mailto:${siteConfig.email}`}
              className="bg-teranga-primary hover:bg-teranga-secondary inline-flex h-12 shrink-0 items-center gap-2 rounded-full px-7 text-sm font-medium text-white transition-colors duration-300"
            >
              {tDetail("ctaButton")}
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}

function NoteBody({ note }: { note: Note }) {
  if (!note.content) {
    return null;
  }
  return (
    <div className="prose-note">
      <RichText
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data={note.content as any}
      />
    </div>
  );
}
