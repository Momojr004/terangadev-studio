import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Posts } from "./collections/Posts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: " · TerangaDev",
      icons: [],
    },
  },
  collections: [Users, Media, Posts],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "dev-secret-change-me",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./terangadev.db",
      // Turso (libsql remote) requiert un authToken — ignoré si DB locale
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
  sharp,
  localization: {
    locales: ["fr", "en"],
    defaultLocale: "fr",
    fallback: true,
  },
  cors: ["http://localhost:3000", "https://terangadev.com"],
  csrf: ["http://localhost:3000", "https://terangadev.com"],
});
