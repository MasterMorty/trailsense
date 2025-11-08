import {H3Event} from "h3";
import {drizzle, DrizzleD1Database} from "drizzle-orm/d1"

export default function getDb(event: H3Event): DrizzleD1Database {
    const db = drizzle(event.context.cloudflare?.env?.DB);
    if (!db) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Database binding "DB" is not configured.'
        })
    }

    return db;
}