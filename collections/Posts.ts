import type { CollectionConfig } from "payload";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "status", "publishedAt"],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true;
      return {
        status: { equals: "published" },
      };
    },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        position: "sidebar",
        description: "URL slug, e.g. 'pourquoi-filament'",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      localized: true,
      admin: {
        description: "Court résumé affiché sur la page index Notes",
      },
    },
    {
      name: "content",
      type: "richText",
      localized: true,
    },
    {
      name: "category",
      type: "select",
      options: [
        { label: "Notes techniques", value: "technical" },
        { label: "Retours produit", value: "product" },
        { label: "Souveraineté & marché", value: "sovereignty" },
        { label: "Pédagogie client", value: "pedagogy" },
      ],
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayAndTime",
        },
      },
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Image de couverture (optionnel)",
      },
    },
    {
      name: "readingMinutes",
      type: "number",
      admin: {
        position: "sidebar",
        description: "Temps de lecture estimé en minutes",
      },
    },
    {
      name: "status",
      type: "select",
      options: [
        { label: "Brouillon", value: "draft" },
        { label: "Publié", value: "published" },
      ],
      defaultValue: "draft",
      required: true,
      admin: {
        position: "sidebar",
      },
    },
  ],
};
