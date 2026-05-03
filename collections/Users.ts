import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email"],
  },
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
    },
  ],
};
