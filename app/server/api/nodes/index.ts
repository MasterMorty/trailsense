import getDb from "~~/server/utils/db";
import {nodes, activities} from "#shared/db/schema";
import {and, sql} from "drizzle-orm";
import {BLE_WEIGHT, WIFI_WEIGHT, normalizeRatio} from "~~/server/utils/activityMetrics";

export default defineEventHandler(async (event) => {
    const db = getDb(event);

    const now = new Date();
    const dayStart = new Date(now);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

    const startSeconds = Math.floor(dayStart.getTime() / 1000);
    const endSeconds = Math.floor(dayEnd.getTime() / 1000);

    const activations = await db
        .select({
            nodeId: activities.nodeId,
            sumValue: sql<number>`SUM(${BLE_WEIGHT} * COALESCE(${activities.ble}, 0) + ${WIFI_WEIGHT} * COALESCE(${activities.wifi}, 0))`,
        })
        .from(activities)
        .where(and(
            sql`unixepoch(${activities.createdAt}) >= ${startSeconds}`,
            sql`unixepoch(${activities.createdAt}) < ${endSeconds}`,
            sql`NOT (${activities.ble} IS NULL AND ${activities.wifi} IS NULL)`
        ))
        .groupBy(activities.nodeId)
        .all();

    const activationMap = new Map<number, number>();
    for (const row of activations) {
        if (typeof row.nodeId === 'number') {
            activationMap.set(row.nodeId, Number(row.sumValue ?? 0));
        }
    }

    const nodesResult = await db.select().from(nodes).all();

    const payload = nodesResult.map((node) => {
        const ratio = normalizeRatio(node.ratio);
        const rawValue = activationMap.get(node.id) ?? 0;
        const activationsToday = Math.trunc(rawValue / ratio);
        return {
            ...node,
            activationsToday,
        };
    });

    return Response.json(payload);
});
