import { getPayload } from "payload";
import payloadConfig from "@payload-config";

export type NoteCategory =
  | "technical"
  | "product"
  | "sovereignty"
  | "pedagogy";

export type Note = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: unknown;
  category: NoteCategory;
  publishedAt?: string | null;
  readingMinutes?: number | null;
  cover?: { url?: string; alt?: string } | string | null;
  status: "draft" | "published";
};

export type NotesLocale = "fr" | "en";

export async function fetchPublishedNotes(
  locale: NotesLocale,
): Promise<Note[]> {
  try {
    const payload = await getPayload({ config: payloadConfig });
    const result = await payload.find({
      collection: "posts",
      where: { status: { equals: "published" } },
      sort: "-publishedAt",
      locale,
      limit: 100,
      overrideAccess: false,
    });
    return result.docs as unknown as Note[];
  } catch (error) {
    console.error("[notes] failed to fetch posts:", error);
    return [];
  }
}

export async function fetchNoteBySlug(
  slug: string,
  locale: NotesLocale,
): Promise<Note | null> {
  try {
    const payload = await getPayload({ config: payloadConfig });
    const result = await payload.find({
      collection: "posts",
      where: {
        and: [
          { slug: { equals: slug } },
          { status: { equals: "published" } },
        ],
      },
      locale,
      limit: 1,
      overrideAccess: false,
    });
    if (!result.docs || result.docs.length === 0) {
      return null;
    }
    return result.docs[0] as unknown as Note;
  } catch (error) {
    console.error("[notes] failed to fetch post by slug:", error);
    return null;
  }
}

export async function fetchAllPublishedSlugs(): Promise<string[]> {
  try {
    const payload = await getPayload({ config: payloadConfig });
    const result = await payload.find({
      collection: "posts",
      where: { status: { equals: "published" } },
      limit: 1000,
      overrideAccess: false,
    });
    return (result.docs as unknown as { slug: string }[]).map((d) => d.slug);
  } catch (error) {
    console.error("[notes] failed to fetch slugs:", error);
    return [];
  }
}
