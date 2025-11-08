import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: 'sqlite', // 'mysql' | 'sqlite' | 'turso'
    schema: './shared/db/schema.ts',
    out: './db/migrations'
})