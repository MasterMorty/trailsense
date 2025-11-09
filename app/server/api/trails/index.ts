import getDb from "~~/server/utils/db";
import {trails} from "#shared/db/schema";
import type {TrailsListResponse} from "#shared/models/api/trails";
import {and, gte, lte} from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const db = getDb(event)
  const query = getQuery(event)
  const bounds = query.bounds as string;
  const [latitudeStart, longitudeStart, latitudeEnd, longitudeEnd] = bounds.split(',').map(Number);

  const result = await db.select()
    .from(trails)
    .where(and(
      gte(trails.latitudeStart, Math.min(latitudeStart, latitudeEnd)),
      lte(trails.latitudeStart, Math.max(latitudeStart, latitudeEnd)),
      gte(trails.longitudeStart, Math.min(longitudeStart, longitudeEnd)),
      lte(trails.longitudeStart, Math.max(longitudeStart, longitudeEnd)),
    ))
    .all();

  return Response.json(result as TrailsListResponse);
})
