import { blob, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const locations = sqliteTable('locations', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  address: text('address')
})

export const nodes = sqliteTable('nodes', {
  id: integer('id').primaryKey(),
  locationId: integer('location_id').references(() => locations.id, { onDelete: 'set null' }),
  status: text('status').notNull()
})

export const trails = sqliteTable('trails', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  locationId: integer('location_id').references(() => locations.id, { onDelete: 'cascade' }),
  pathData: blob('path_data')
})

export const activities = sqliteTable('activities', {
  id: integer('id').primaryKey(),
  nodeId: integer('node_id').references(() => nodes.id, { onDelete: 'cascade' }),
  ble: integer('ble'),
  wifi: integer('wifi'),
  temperature: real('temperature'),
  humidity: real('humidity'),
  createdAt: text('created_at')
})

export type Location = typeof locations.$inferSelect
export type NewLocation = typeof locations.$inferInsert

export type Node = typeof nodes.$inferSelect
export type NewNode = typeof nodes.$inferInsert

export type Trail = typeof trails.$inferSelect
export type NewTrail = typeof trails.$inferInsert

export type Activity = typeof activities.$inferSelect
export type NewActivity = typeof activities.$inferInsert
