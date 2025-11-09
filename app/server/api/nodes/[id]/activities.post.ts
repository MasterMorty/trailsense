import getDb from "~~/server/utils/db";
import { createError } from 'h3';
import {activities, NewActivity} from "#shared/db/schema";
import type {CreateActivityBody, CreateActivityResponse} from "#shared/models/api/nodes";

export default defineEventHandler(async (event) => {
    const nodeId = parseInt(getRouterParam(event, 'id') ?? '');
    if (isNaN(nodeId)) {
        throw createError({statusCode: 400, statusMessage: "Invalid or missing node ID"});
    }

    const requestBody = await readBody<CreateActivityBody>(event);
    const body = {...requestBody, nodeId} as NewActivity;
    const db = getDb(event);

    const result = await db.insert(activities).values(body).returning().get();

    return Response.json(result as CreateActivityResponse);
})
