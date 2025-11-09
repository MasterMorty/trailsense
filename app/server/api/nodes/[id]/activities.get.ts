import getDb from "~~/server/utils/db";
import {Period} from "#shared/models/period";
import {activities, nodes} from "#shared/db/schema";
import {and, eq, sql} from "drizzle-orm";
import { createError } from 'h3';
import {BLE_WEIGHT, WIFI_WEIGHT, normalizeRatio, roundToSingleDecimal} from "~~/server/utils/activityMetrics";
import type {NodeActivitiesResponse, ActivitySummaryBucket} from "#shared/models/api/nodes";

export default defineEventHandler(async (event) => {
    const nodeId = parseInt(getRouterParam(event, 'id') ?? '');
    if (isNaN(nodeId)) {
        throw createError({statusCode: 400, statusMessage: "Invalid or missing node ID"});
    }

    let period = getQuery(event).period as Period | undefined ;
    if(period !== undefined && period !== Period.DAY && period !== Period.WEEK && period !== Period.MONTH) {
        throw createError({statusCode: 400, statusMessage: "Invalid period parameter"});
    } else if(period === undefined) {
        period = Period.DAY;
    }

    let date = getQuery(event).date as string | undefined;
    if(date === undefined) {
        const now = new Date();
        date = now.toISOString().split('T')[0];
    } else {
        const parsedDate = new Date(date);
        if(isNaN(parsedDate.getTime())) {
            throw createError({statusCode: 400, statusMessage: "Invalid date parameter"});
        }
    }

    const baseDate = new Date(date);
    baseDate.setUTCHours(0, 0, 0, 0);

    const { rangeStart, bucketCount, bucketDurationMs } = getRangeSettings(period, baseDate);
    const rangeEnd = new Date(rangeStart.getTime() + bucketCount * bucketDurationMs);

    const startSeconds = Math.floor(rangeStart.getTime() / 1000);
    const endSeconds = Math.floor(rangeEnd.getTime() / 1000);
    const bucketDurationSeconds = Math.floor(bucketDurationMs / 1000);

    const db = getDb(event);

    const nodeRecord = await db
        .select({ ratio: nodes.ratio })
        .from(nodes)
        .where(eq(nodes.id, nodeId))
        .get();

    if (!nodeRecord) {
        throw createError({statusCode: 404, statusMessage: "Node not found"});
    }

    const ratio = normalizeRatio(nodeRecord.ratio);

    const bucketExpr = sql<number>`CAST((unixepoch(${activities.createdAt}) - ${startSeconds}) / ${bucketDurationSeconds} AS INTEGER)`;

    const aggregates = await db
        .select({
            bucket: bucketExpr,
            activationSum: sql<number>`SUM(${BLE_WEIGHT} * COALESCE(${activities.ble}, 0) + ${WIFI_WEIGHT} * COALESCE(${activities.wifi}, 0))` ,
            activationSamples: sql<number>`COUNT(*)`,
            temperatureAvg: sql<number>`AVG(${activities.temperature})`,
            temperatureSamples: sql<number>`COUNT(${activities.temperature})`,
        })
        .from(activities)
        .where(and(
            eq(activities.nodeId, nodeId),
            sql`unixepoch(${activities.createdAt}) >= ${startSeconds}`,
            sql`unixepoch(${activities.createdAt}) < ${endSeconds}`,
            sql`NOT (${activities.ble} IS NULL AND ${activities.wifi} IS NULL)`
        ))
        .groupBy(bucketExpr)
        .orderBy(bucketExpr)
        .all();

    const data = buildSummariesFromAggregates({
        aggregates,
        rangeStart,
        bucketCount,
        bucketDurationMs,
        ratio,
    });

    const totals = {
        activations: data.reduce((acc, bucket) => acc + bucket.activations, 0),
        samples: data.reduce((acc, bucket) => acc + bucket.samples, 0),
        temperatureSum: aggregates.reduce((acc, row) => {
            const samples = Number(row.temperatureSamples ?? 0);
            const avg = row.temperatureAvg;
            if (samples > 0 && typeof avg === 'number') {
                return acc + avg * samples;
            }
            return acc;
        }, 0),
        temperatureSamples: aggregates.reduce((acc, row) => acc + Number(row.temperatureSamples ?? 0), 0),
    };

    const response: NodeActivitiesResponse = {
        nodeId,
        period,
        date,
        rangeStart: rangeStart.toISOString(),
        rangeEnd: rangeEnd.toISOString(),
        totals: {
            activations: totals.activations,
            samples: totals.samples,
            temperature: totals.temperatureSamples > 0
                ? roundToSingleDecimal(totals.temperatureSum / totals.temperatureSamples)
                : null,
            temperatureSamples: totals.temperatureSamples,
        },
        ratio,
        data,
    };

    return Response.json(response);

});

type AggregateRow = {
    bucket: number | null;
    activationSum: number | null;
    activationSamples: number | null;
    temperatureAvg: number | null;
    temperatureSamples: number | null;
};


function getRangeSettings(period: Period, baseDate: Date) {
    const hourMs = 60 * 60 * 1000;
    const dayMs = 24 * hourMs;

    if (period === Period.DAY) {
        return {
            rangeStart: new Date(baseDate),
            bucketCount: 24,
            bucketDurationMs: hourMs,
        };
    }

    if (period === Period.WEEK) {
        const rangeStart = new Date(baseDate);
        const dayOfWeek = rangeStart.getUTCDay();
        const daysToMonday = (dayOfWeek + 6) % 7;
        rangeStart.setUTCDate(rangeStart.getUTCDate() - daysToMonday);

        return {
            rangeStart,
            bucketCount: 7,
            bucketDurationMs: dayMs,
        };
    }

    const year = baseDate.getUTCFullYear();
    const month = baseDate.getUTCMonth();
    const rangeStart = new Date(Date.UTC(year, month, 1));
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

    return {
        rangeStart,
        bucketCount: daysInMonth,
        bucketDurationMs: dayMs,
    };
}

function buildSummariesFromAggregates({
    aggregates,
    rangeStart,
    bucketCount,
    bucketDurationMs,
    ratio,
}: {
    aggregates: AggregateRow[];
    rangeStart: Date;
    bucketCount: number;
    bucketDurationMs: number;
    ratio: number;
}): ActivitySummaryBucket[] {
    const rangeStartMs = rangeStart.getTime();
    const bucketMap = new Map<number, {
        activationSum: number;
        samples: number;
        temperatureAvg: number | null;
        temperatureSamples: number;
    }>();

    for (const row of aggregates) {
        const numericBucket = typeof row.bucket === 'number' ? row.bucket : Number(row.bucket);
        if (!Number.isFinite(numericBucket)) {
            continue;
        }

        const bucketIndex = Math.trunc(numericBucket);
        if (bucketIndex < 0 || bucketIndex >= bucketCount) {
            continue;
        }
        bucketMap.set(bucketIndex, {
            activationSum: Number(row.activationSum ?? 0),
            samples: Number(row.activationSamples ?? 0),
            temperatureAvg: row.temperatureAvg ?? null,
            temperatureSamples: Number(row.temperatureSamples ?? 0),
        });
    }

    return Array.from({ length: bucketCount }, (_, index) => {
        const bucketStart = new Date(rangeStartMs + index * bucketDurationMs);
        const bucketEnd = new Date(bucketStart.getTime() + bucketDurationMs);
        const bucketData = bucketMap.get(index);
        const activationAdjusted = (bucketData?.activationSum ?? 0) / ratio;
        const activations = Math.trunc(activationAdjusted);
        const temperature = bucketData && bucketData.temperatureSamples > 0 && typeof bucketData.temperatureAvg === 'number'
            ? roundToSingleDecimal(bucketData.temperatureAvg)
            : null;

        return {
            start: bucketStart.toISOString(),
            end: bucketEnd.toISOString(),
            activations,
            samples: bucketData?.samples ?? 0,
            temperature,
        };
    });
}
