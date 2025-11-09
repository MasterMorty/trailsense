import getDb from "~~/server/utils/db";
import { createError } from 'h3';
import {activities, Activity} from "#shared/db/schema";

export default defineEventHandler(async (event) => {
import {activities, Activity, NewActivity} from "#shared/db/schema";

export default defineEventHandler(async (event) => {
    const nodeId = parseInt(getRouterParam(event, 'id') ?? '');

    const body = {...(await readBody(event)), nodeId} as NewActivity;
    const db = getDb(event);

    const result = await db.insert(activities).values(body).returning().all();

    return Response.json(result);
})
