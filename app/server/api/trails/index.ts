import getDb from "~~/server/utils/db";
import {trails} from "#shared/db/schema";
import type {TrailsListResponse} from "#shared/models/api/trails";

export default defineEventHandler(async (event) => {
    const db = getDb(event)

    const result = await db.select().from(trails).all();

    return Response.json(result as TrailsListResponse);
})
