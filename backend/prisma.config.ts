import "dotenv/config";             // jika pakai .env
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  datasource: {
    url: env("DATABASE_URL"),      // ambil URL dari .env
  },
  // optional: bisa set engine, migrations path, dsb
  // engine: "classic",
  // migrations: { ... }
});
