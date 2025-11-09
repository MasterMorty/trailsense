import { blob, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import {sql} from "drizzle-orm";

export const trails = sqliteTable('trails', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  pathData: blob('path_data'),
  latitudeStart: real('latitude_start'),
  longitudeStart: real('longitude_start')
})

export const nodes = sqliteTable('nodes', {
  id: integer('id').primaryKey(),
  trailId: integer('trail_id').references(() => trails.id, { onDelete: 'cascade' }),
  status: text('status').notNull(),
  ratio: real('ratio').notNull().default(1),
  battery: real('battery').notNull().default(0.75)
})

export const activities = sqliteTable('activities', {
  id: integer('id').primaryKey(),
  nodeId: integer('node_id').references(() => nodes.id, { onDelete: 'cascade' }).notNull(),
  ble: integer('ble'),
  wifi: integer('wifi'),
  temperature: real('temperature'),
  humidity: real('humidity'),
  createdAt: text('created_at').default(sql`(current_timestamp)`).notNull()
})

export type Node = typeof nodes.$inferSelect
export type NewNode = typeof nodes.$inferInsert

export type Trail = typeof trails.$inferSelect
export type NewTrail = typeof trails.$inferInsert

export type Activity = typeof activities.$inferSelect
export type NewActivity = typeof activities.$inferInsert
