import getDb from "~~/server/utils/db";
import {locations} from "#shared/db/schema";

export default defineEventHandler(async (event) => {
    const db = getDb(event)

    const result = await db.select().from(locations).all();

    return Response.json(result);
})
