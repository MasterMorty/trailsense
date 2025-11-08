import getDb from "~~/server/utils/db";
import {nodes} from "#shared/db/schema";

export default defineEventHandler(async (event) => {
    const db = getDb(event)

    const result = await db.select().from(nodes).all();

    return Response.json(result);
})
