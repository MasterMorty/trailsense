import type { Node } from '#shared/db/schema'
import type { Activity } from '#shared/db/schema'
import type { NewActivity } from '#shared/db/schema'
import type { Period } from '#shared/models/period'

export interface NodeWithActivationsToday extends Node {
  activationsToday: number
  trailName: string;
}

export type NodesListResponse = NodeWithActivationsToday[]

export type CreateActivityBody = Omit<NewActivity, 'nodeId'>

export interface ActivitySummaryBucket {
  start: string
  end: string
  activations: number
  samples: number
  temperature: number | null
}

export interface ActivityTotals {
  activations: number
  samples: number
  temperature: number | null
  temperatureSamples: number
}

export interface NodeActivitiesResponse {
  nodeId: number
  period: Period
  date: string
  rangeStart: string
  rangeEnd: string
  ratio: number
  totals: ActivityTotals
  data: ActivitySummaryBucket[]
}

export type CreateActivityResponse = Activity
