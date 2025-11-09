import getDb from "~~/server/utils/db";
import { createError } from 'h3';
import {activities, Activity} from "#shared/db/schema";

export default defineEventHandler(async (event) => {
    const nodeId = parseInt(getRouterParam(event, 'id') ?? '');
    if (isNaN(nodeId)) {
        throw createError({ statusCode: 400, statusMessage: "Invalid or missing node ID" });
    }

    const body = {...(await readBody(event)), nodeId} as Activity;
    const db = getDb(event);

    const result = await db.insert(activities).values(body).returning().all();

    return Response.json(result);
})
