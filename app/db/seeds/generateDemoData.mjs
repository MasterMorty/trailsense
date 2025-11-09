#!/usr/bin/env node

import { createWriteStream, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { once } from 'node:events'

const TRAILS = [
  { id: 1, name: 'Arena Innovationsrunde (Loop)' },
  { id: 2, name: 'Höttinger Alm Panorama-Runde' },
  { id: 3, name: 'Gaistal Almenweg zur Tillfussalm' },
  { id: 4, name: 'Zittauer Hütte Zustieg ab Finkau' },
]

const VISITOR_PATTERNS = [
  {
    label: 'Early Birds',
    morningPeak: 7.75,
    dayPeak: 13.25,
    eveningPeak: 18.25,
    morningSpread: 1.4,
    daySpread: 2.1,
    eveningSpread: 1.6,
    morningWeight: 1.35,
    dayWeight: 0.85,
    eveningWeight: 0.9,
  },
  {
    label: 'Day Trippers',
    morningPeak: 9,
    dayPeak: 14.25,
    eveningPeak: 19,
    morningSpread: 1.8,
    daySpread: 2.4,
    eveningSpread: 1.7,
    morningWeight: 0.8,
    dayWeight: 1.3,
    eveningWeight: 0.85,
  },
  {
    label: 'Sunset Crowd',
    morningPeak: 8.5,
    dayPeak: 15,
    eveningPeak: 20,
    morningSpread: 1.6,
    daySpread: 2.2,
    eveningSpread: 1.3,
    morningWeight: 0.9,
    dayWeight: 0.95,
    eveningWeight: 1.45,
  },
]

const DEFAULTS = {
  nodeCount: 5,
  days: 30,
  slotMinutes: 5,
  maxVisitorsPerSlot: 15,
  globalTrafficMultiplier: 1,
  busyFactor: 1.35,
  calmFactor: 0.75,
  output: './db/seeds/demo.sql',
  seed: undefined,
}

const args = parseArgs(process.argv.slice(2))
const config = buildConfig(args)

const rng = createRng(config.seed)

async function main() {
  const outputPath = resolve(process.cwd(), config.output)
  mkdirSync(dirname(outputPath), { recursive: true })
  const writer = createWriteStream(outputPath, { encoding: 'utf8' })

  const writeChunk = async (chunk) => {
    if (!writer.write(chunk)) {
      await once(writer, 'drain')
    }
  }

  const slotDurationMs = config.slotMinutes * 60 * 1000
  const slotsPerDay = Math.floor((24 * 60) / config.slotMinutes)
  const totalSlots = config.days * slotsPerDay
  const startArg = typeof args.start === 'string' ? args.start : undefined
  const startTime = getStartTime(startArg, config.days, config.slotMinutes)
  const dayWeather = buildDayWeather(config.days)
  const nodeProfiles = buildNodeProfiles(config.nodeCount)

  await writeChunk('-- Auto-generated demo dataset.\n')
  await writeChunk(`-- Generated at ${new Date().toISOString()}\n`)
  await writeChunk('-- Adjust parameters via generateDemoData.mjs CLI flags.\n\n')
  await writeChunk('PRAGMA foreign_keys = OFF;\n')
  await writeChunk('DELETE FROM activities;\nDELETE FROM nodes;\n')

  await writeChunk('\nINSERT OR IGNORE INTO trails (id, name, path_data) VALUES\n')
  for (let i = 0; i < TRAILS.length; i++) {
    const suffix = i === TRAILS.length - 1 ? ';\n\n' : ',\n'
    await writeChunk(`  (${TRAILS[i].id}, '${TRAILS[i].name.replace(/'/g, "''")}', NULL)${suffix}`)
  }

  await writeNodes(writeChunk, nodeProfiles)
  await writeActivities(writeChunk, {
    nodeProfiles,
    dayWeather,
    startTime,
    totalSlots,
    slotsPerDay,
    slotDurationMs,
  })

  await writeChunk('PRAGMA foreign_keys = ON;\n')

  await new Promise((resolve, reject) => {
    writer.end(() => resolve())
    writer.on('error', reject)
  })

  console.log(`Seed file created at ${outputPath}`)
}

main().catch((error) => {
  console.error('Failed to generate demo data:', error)
  process.exit(1)
})

async function writeNodes(writeChunk, nodes) {
  await writeChunk('INSERT INTO nodes (trail_id, status, ratio, battery) VALUES\n')
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]
    const suffix = i === nodes.length - 1 ? ';\n\n' : ',\n'
    await writeChunk(
      `  (${node.trailId}, '${node.status}', ${node.ratio.toFixed(3)}, ${node.battery.toFixed(3)})${suffix}`,
    )
  }
}

async function writeActivities(writeChunk, context) {
  const { nodeProfiles, dayWeather, startTime, totalSlots, slotsPerDay, slotDurationMs } = context
  const batch = []
  const batchSize = 900

  const flushBatch = async () => {
    if (batch.length === 0) return
    const values = batch
      .map((row, index) => `  ${row}${index === batch.length - 1 ? ';\n' : ',\n'}`)
      .join('')
    await writeChunk('INSERT INTO activities (node_id, ble, wifi, temperature, humidity, created_at) VALUES\n')
    await writeChunk(values)
    await writeChunk('\n')
    batch.length = 0
  }

  for (const node of nodeProfiles) {
    for (let slotIndex = 0; slotIndex < totalSlots; slotIndex++) {
      const slotTime = new Date(startTime.getTime() + slotIndex * slotDurationMs)
      const dayIndex = Math.floor(slotIndex / slotsPerDay)
      const weather = dayWeather[dayIndex]

      const stats = buildSlotStats(slotTime, node, weather)
      batch.push(
        `(${node.id}, ${stats.ble}, ${stats.wifi}, ${stats.temperature.toFixed(1)}, ${stats.humidity.toFixed(0)}, '${formatDateTime(slotTime)}')`,
      )

      if (batch.length >= batchSize) {
        await flushBatch()
      }
    }
  }

  await flushBatch()
}

function buildSlotStats(timestamp, node, weather) {
  const hour = timestamp.getHours() + timestamp.getMinutes() / 60
  const weekendBoost = isWeekend(timestamp) ? node.weekendBoost : 1
  const timeFactor = computeTimeFactor(hour, node.pattern)
  const nightFactor = getNightFactor(hour)
  const weatherTraffic = getWeatherTrafficFactor(hour, weather)
  const slotVariance = randomRange(0.85, 1.15)

  const expectedVisitors =
    timeFactor *
    nightFactor *
    weekendBoost *
    weatherTraffic *
    slotVariance *
    node.trafficMultiplier *
    config.maxVisitorsPerSlot

  const baseVisitors = Math.max(0, expectedVisitors)
  const visitorStd = Math.max(1, baseVisitors * 0.35)
  const ble = clamp(Math.round(randomNormal(baseVisitors, visitorStd)), 0, config.maxVisitorsPerSlot)

  let wifi = ble
  const prefersBle = randomRange(0, 1) > 0.15
  if (prefersBle) {
    wifi = clamp(ble - randomInt(1, 2), 0, config.maxVisitorsPerSlot)
  } else if (ble > 0) {
    wifi = clamp(ble - randomInt(0, 1), 0, config.maxVisitorsPerSlot)
  }

  const temperature = computeTemperature(hour, weather)
  const humidity = computeHumidity(temperature, weather)

  return { ble, wifi, temperature, humidity }
}

function computeTimeFactor(hour, pattern) {
  const gaussian = (peak, spread, weight) => weight * Math.exp(-0.5 * Math.pow((hour - peak) / spread, 2))
  const combined =
    gaussian(pattern.morningPeak, pattern.morningSpread, pattern.morningWeight) +
    gaussian(pattern.dayPeak, pattern.daySpread, pattern.dayWeight) +
    gaussian(pattern.eveningPeak, pattern.eveningSpread, pattern.eveningWeight)

  return clamp(combined, 0, 1.35)
}

function getNightFactor(hour) {
  if (hour < 4) return 0
  if (hour < 6) return 0.2
  if (hour >= 22.5) return 0.05
  if (hour >= 21) return 0.25
  return 1
}

function getWeatherTrafficFactor(hour, weather) {
  let factor = 1
  if (weather.rainy && Math.abs(hour - weather.rainyWindowStart) <= 1.5) {
    factor *= weather.rainyImpact
  }
  if (weather.coldSnap && hour >= 11 && hour <= 16) {
    factor *= weather.coldSnapImpact
  }
  return factor
}

function computeTemperature(hour, weather) {
  const minutes = hour * 60
  const progress = (minutes % 1440) / 1440
  const shifted = (progress - 0.125 + 1) % 1
  const heatCurve = Math.sin(Math.PI * Math.min(Math.max(shifted, 0), 1))
  let temperature = weather.low + (weather.high - weather.low) * heatCurve

  if (weather.rainy && Math.abs(hour - weather.rainyWindowStart) <= 1.5) {
    temperature -= randomRange(1.5, 4)
  }
  if (weather.coldSnap && hour >= 10 && hour <= 17) {
    temperature -= weather.coldSnapDrop
  }

  temperature += randomRange(-0.9, 0.9)
  return Number(temperature.toFixed(1))
}

function computeHumidity(temperature, weather) {
  const span = weather.high - weather.low
  const relative = span === 0 ? 0.5 : clamp((weather.high - temperature) / span, 0, 1)
  let humidity = 45 + relative * 45 + randomRange(-5, 6)
  if (weather.rainy) {
    humidity += 5
  }
  return clamp(Math.round(humidity), 35, 98)
}

function buildDayWeather(days) {
  const patterns = []
  let baselineLow = randomRange(2, 8)
  for (let i = 0; i < days; i++) {
    baselineLow += randomRange(-0.4, 0.4)
    const low = clamp(baselineLow, -4, 14)
    const span = randomRange(8, 15)
    const high = low + span
    const rainy = randomRange(0, 1) < 0.28
    patterns.push({
      low,
      high,
      rainy,
      rainyWindowStart: randomInt(11, 17),
      rainyImpact: rainy ? randomRange(0.55, 0.85) : 1,
      coldSnap: randomRange(0, 1) < 0.18,
      coldSnapImpact: randomRange(0.75, 0.95),
      coldSnapDrop: randomRange(1.2, 3.8),
    })
  }
  return patterns
}

function buildNodeProfiles(count) {
  const nodes = []
  const busySlice = Math.max(1, Math.floor(count / 3))
  const calmSlice = Math.max(1, Math.floor(count / 4))
  const statusPlan = assignNodeStatuses(count)

  for (let i = 0; i < count; i++) {
    const pattern = clonePattern(VISITOR_PATTERNS[i % VISITOR_PATTERNS.length])
    const categoryMultiplier =
      i >= count - busySlice
        ? config.busyFactor
        : i < calmSlice
          ? config.calmFactor
          : 1
    const trafficMultiplier =
      categoryMultiplier * config.globalTrafficMultiplier * randomRange(0.85, 1.15)

    nodes.push({
      id: i + 1,
      trailId: TRAILS[i % TRAILS.length].id,
      status: statusPlan[i] ?? 'healthy',
      ratio: clamp(trafficMultiplier, 0.5, 1.5),
      battery: clamp(randomRange(0.55, 0.95), 0.3, 1),
      pattern,
      weekendBoost: randomRange(1.05, 1.35),
      trafficMultiplier,
    })
  }

  return nodes
}

function assignNodeStatuses(count) {
  if (count <= 0) return []
  const statuses = new Array(count).fill('healthy')

  const offlineIndices = pickUniqueIndices(count, Math.min(1, count))
  offlineIndices.forEach((index) => {
    statuses[index] = 'offline'
  })

  const availableForBattery = count - offlineIndices.size
  let batteryLowCount = Math.round(count * randomRange(0.15, 0.25))
  if (availableForBattery <= 1) {
    batteryLowCount = 0
  } else {
    batteryLowCount = clamp(batteryLowCount, 1, availableForBattery - 1)
  }

  const batteryLowIndices = pickUniqueIndices(count, batteryLowCount, offlineIndices)
  batteryLowIndices.forEach((index) => {
    statuses[index] = 'battery_low'
  })

  return statuses
}

function pickUniqueIndices(poolSize, desired, exclude = new Set()) {
  const result = new Set()
  if (poolSize <= 0 || desired <= 0 || exclude.size >= poolSize) {
    return result
  }

  const target = Math.min(desired, poolSize - exclude.size)
  while (result.size < target) {
    const candidate = randomInt(0, poolSize - 1)
    if (exclude.has(candidate) || result.has(candidate)) continue
    result.add(candidate)
  }

  return result
}

function clonePattern(pattern) {
  return {
    ...pattern,
    morningPeak: pattern.morningPeak + randomRange(-0.4, 0.4),
    dayPeak: pattern.dayPeak + randomRange(-0.5, 0.5),
    eveningPeak: pattern.eveningPeak + randomRange(-0.5, 0.5),
    morningWeight: pattern.morningWeight * randomRange(0.9, 1.1),
    dayWeight: pattern.dayWeight * randomRange(0.9, 1.1),
    eveningWeight: pattern.eveningWeight * randomRange(0.9, 1.1),
  }
}

function getStartTime(startArg, days, slotMinutes) {
  if (startArg) {
    const parsed = new Date(startArg)
    if (isNaN(parsed.getTime())) {
      throw new Error(`Invalid start date provided: ${startArg}`)
    }
    return alignToSlot(parsed, slotMinutes)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(today)
  start.setDate(start.getDate() - (days - 1))
  return alignToSlot(start, slotMinutes)
}

function alignToSlot(date, slotMinutes) {
  const aligned = new Date(date)
  aligned.setSeconds(0, 0)
  const minutes = aligned.getMinutes()
  aligned.setMinutes(minutes - (minutes % slotMinutes))
  return aligned
}

function buildConfig(args) {
  return {
    nodeCount: Math.max(1, parseIntArg(args.nodes, DEFAULTS.nodeCount)),
    days: Math.max(1, parseIntArg(args.days, DEFAULTS.days)),
    slotMinutes: Math.max(1, parseIntArg(args['slot-minutes'], DEFAULTS.slotMinutes)),
    maxVisitorsPerSlot: Math.max(1, parseIntArg(args['max-visitors'], DEFAULTS.maxVisitorsPerSlot)),
    globalTrafficMultiplier: parseFloatArg(args['global-traffic'], DEFAULTS.globalTrafficMultiplier),
    busyFactor: parseFloatArg(args['busy-factor'], DEFAULTS.busyFactor),
    calmFactor: parseFloatArg(args['calm-factor'], DEFAULTS.calmFactor),
    output: typeof args.output === 'string' ? args.output : DEFAULTS.output,
    seed: args.seed !== undefined ? parseIntArg(args.seed, Date.now()) : Date.now(),
  }
}

function parseArgs(argv) {
  const parsed = {}
  for (let i = 0; i < argv.length; i++) {
    const part = argv[i]
    if (!part.startsWith('--')) continue
    const [rawKey, rawValue] = part.slice(2).split('=')
    const key = rawKey
    if (rawValue !== undefined) {
      parsed[key] = rawValue
    } else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) {
      parsed[key] = argv[i + 1]
      i++
    } else {
      parsed[key] = true
    }
  }
  return parsed
}

function parseIntArg(value, fallback) {
  const num = Number(value)
  return Number.isFinite(num) ? Math.trunc(num) : fallback
}

function parseFloatArg(value, fallback) {
  const num = Number(value)
  return Number.isFinite(num) ? num : fallback
}

function createRng(seedValue = Date.now()) {
  let seed = seedValue >>> 0
  if (!seed) seed = 1
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function randomRange(min, max) {
  return min + (max - min) * rng()
}

function randomInt(min, max) {
  return Math.floor(randomRange(min, max + 1))
}

function randomNormal(mean, stdDev) {
  let u = 0
  let v = 0
  while (u === 0) u = rng()
  while (v === 0) v = rng()
  const mag = Math.sqrt(-2.0 * Math.log(u))
  const z = mag * Math.cos(2.0 * Math.PI * v)
  return mean + z * stdDev
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function formatDateTime(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

function isWeekend(date) {
  const day = date.getDay()
  return day === 0 || day === 6
}
