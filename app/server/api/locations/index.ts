import getDb from "~~/server/utils/db";
import {locations} from "#shared/db/schema";
import type {LocationsListResponse} from "#shared/models/api/locations";

export default defineEventHandler(async (event) => {
    const db = getDb(event)

    const result = await db.select().from(locations).all();

    return Response.json(result as LocationsListResponse);
})
