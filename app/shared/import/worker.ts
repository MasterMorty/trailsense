import {drizzle, DrizzleD1Database} from "drizzle-orm/d1";
import * as fs from "node:fs";
import {createReadStream} from "node:fs";
import path from 'path';
import {fileURLToPath} from 'url';
import {Transform} from 'node:stream';
import pkg from '@googlemaps/polyline-codec';
import StreamArray from 'stream-json/streamers/StreamArray';
import streamjson from "stream-json";

import * as schema from '../db/schema';

const {encode} = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const {trails} = schema;

const JSON_FILE_PATH = path.join(__dirname, '..', '..', '..', 'data', 'tours.json');
const BATCH_SIZE = 10;

class DrizzleBatchTransform extends Transform {
  private batch: schema.Trail[] = [];
  private db: DrizzleD1Database;
  private totalProcessed: number = 0;

  constructor(db: DrizzleD1Database, options: { BATCH_SIZE: number }) {
    super({objectMode: true});
    this.db = db;
  }

  override async _transform(chunk: {
    key: number,
    value: any
  }, encoding: string, callback: (error?: Error, data?: any) => void) {
    try {
      const trail = chunk.value;
      const geoData = JSON.parse(trail.geo);
      const rawGeoString = geoData?.geometry?.value;

      if (rawGeoString) {
        const coordinates = parseCoordinateString(rawGeoString);

        if (coordinates.coordinates && coordinates.coordinates.length > 0) {
          const encodedPathData = encode(coordinates.coordinates!, 5);

          this.batch.push({
            id: trail.id,
            name: trail.title,
            pathData: encodedPathData,
            latitudeStart: coordinates.latitudeStart!,
            longitudeStart: coordinates.longitudeStart!
          });

          this.totalProcessed++;
        }
      }

      if (this.batch.length >= BATCH_SIZE) {
        console.log(`Processing - inserting ${this.totalProcessed} records. Batch size: ${this.batch.length}`);

        await this.db.insert(trails).values(this.batch).onConflictDoNothing();

        this.batch = [];
      }

      callback();

    } catch (err: any) {
      console.error(`Error processing entry (ID: ${chunk.value?.id}):`, err.message);
      // Call callback to continue the stream, even if one entry failed
      callback();
    }
  }

  // This method is called when the input stream has ended
  override async _flush(callback: (error?: Error, data?: any) => void) {
    if (this.batch.length > 0) {
      console.log(`Inserting final ${this.batch.length} records...`);
      try {
        await this.db.insert(trails).values(this.batch);
      } catch (err) {
        console.error('Error inserting final batch:', err);
      }
    }

    console.log(`Total records processed: ${this.totalProcessed}`);
    callback();
  }
}

export const workWorkWork = async (db: DrizzleD1Database) => {
  const fileStream = createReadStream(JSON_FILE_PATH);
  const jsonParser = new streamjson.Parser();
  const jsonStream = new StreamArray();
  const batchTransform = new DrizzleBatchTransform(db, {BATCH_SIZE});

  const pipeline = fileStream
    .pipe(jsonParser)
    .pipe(jsonStream)
    .pipe(batchTransform);

  return new Promise<void>((resolve, reject) => {
    pipeline.on('finish', () => {
      resolve();
    });

    pipeline.on('error', (err) => {
      console.error('Pipeline Error:', err);
      reject(err);
    });
  });
}

const parseCoordinateString = (geoString: string): {
  coordinates?: number[][],
  latitudeStart?: number,
  longitudeStart?: number
} => {
  const numberMatches = geoString.match(/-?\d+(\.\d+)?/g);

  if (!numberMatches || numberMatches.length < 2 || numberMatches.length % 2 !== 0) {
    return {};
  }

  // Removed the arbitrary numberMatches.length > 300 check
  // as it seems to reject valid, long coordinate lists.

  const coordinates = [];
  for (let i = 0; i < numberMatches.length; i += 2) {
    coordinates.push([
      Number(numberMatches[i]),
      Number(numberMatches[i + 1])
    ]);
  }

  return {
    coordinates: coordinates as number[][],
    latitudeStart: Number(numberMatches[0]),
    longitudeStart: Number(numberMatches[1]),
  }
}