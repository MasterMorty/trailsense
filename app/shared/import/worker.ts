import {DrizzleD1Database} from "drizzle-orm/d1";
import StreamArray from 'stream-json/streamers/StreamArray';
import * as fs from "node:fs";
import pkg from '@googlemaps/polyline-codec';
import * as schema from '../db/schema';
import path from 'path';
import {fileURLToPath} from 'url';
import * as crypto from 'node:crypto';

const {encode} = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const {trails} = schema;

const JSON_FILE_PATH = path.join(__dirname, '..', '..', '..', 'data', 'tours.json');
const BATCH_SIZE = 1;

export const workWorkWork = async (db: DrizzleD1Database) => {
  // @ts-ignore
  let batch = [];
  let totalProcessed = 0;

  const fileStream = fs.createReadStream(JSON_FILE_PATH);
  const jsonStream = StreamArray.withParser();
  const processingStream = fileStream.pipe(jsonStream);

  await new Promise<void>((resolve, reject) => {

    const processBatch = async () => {
      if (batch.length > 0) {
        console.log(`Processing - inserted ${totalProcessed} records.`);
        try {
          // @ts-ignore
          await db.insert(trails).values(batch);
          batch = [];
          processingStream.resume();
        } catch (err) {
          processingStream.destroy();
          return reject(err);
        }
      } else {
        processingStream.resume();
      }
    };

    processingStream.on('data', async ({value: trail}) => {
      try {
        const trailId = crypto.randomUUID();
        if (!trailId) {
          console.warn(`Skipping entry due to missing ID: ${JSON.stringify(trail).substring(0, 50)}...`);
          return;
        }

        let geoData;
        try {
          geoData = JSON.parse(trail.geo);
        } catch (e) {
          console.error(`Skipping entry ${trailId}: Failed to parse 'geo' string.`, e);
          return;
        }

        const rawGeoString = geoData?.geometry?.value;

        if (!rawGeoString) return;

        const result = parseCoordinateString(rawGeoString);
        if (!result.coordinates) return;

        const encodedPathData = encode(result.coordinates, 5);

        batch.push({
          id: trailId,
          name: trail.title,
          pathData: encodedPathData,
          latitudeStart: result.latitudeStart,
          longitudeStart: result.longitudeStart
        });

        totalProcessed++;

        if (batch.length >= BATCH_SIZE) {
          processingStream.pause();
          await processBatch();
        }
      } catch (err) {
        console.error(`Error processing entry (ID: ${trail.globalId || trail.id || 'unknown'}):`, err);
      }
    });

    processingStream.on('error', (err) => {
      console.error('Non-fatal JSON stream parsing error:', err.message);

      processingStream.resume();
    });

    processingStream.on('end', async () => {
      console.log('Stream ended. Inserting final batch...');
      if (batch.length > 0) {
        try {
          // @ts-ignore
          await db.insert(trails).values(batch);
        } catch (err) {
          return reject(err);
        }
      }
      console.log(`Total records processed: ${totalProcessed}`);
      resolve();
    });

    fileStream.on('error', (err) => {
      console.error('Fatal File Stream Error:', err);
      reject(err);
    });

    processingStream.resume();
  });

  return;
}

function* numberIterator(geoString: string): Generator<number> {
  let currentPos = 0;
  while (currentPos < geoString.length) {
    let nextSpace = geoString.indexOf(' ', currentPos);
    if (nextSpace === -1) {
      nextSpace = geoString.length;
    }

    const numberString = geoString.slice(currentPos, nextSpace);

    if (numberString.length > 0) {
      yield Number(numberString);
    }

    currentPos = nextSpace + 1;
  }
}

const parseCoordinateString = (geoString: string) => {
  const numbers = numberIterator(geoString);
  const coordinates: number[][] = [];

  let lat = numbers.next();
  let lon = numbers.next();

  let latitudeStart: number | undefined;
  let longitudeStart: number | undefined;

  while (!lat.done && !lon.done) {
    if (coordinates.length === 0) {
      latitudeStart = lat.value;
      longitudeStart = lon.value;
    }

    coordinates.push([lat.value, lon.value]);

    lat = numbers.next();
    lon = numbers.next();
  }

  if (coordinates.length === 0 || !lat.done || !lon.done) {
    return {};
  }

  return {
    coordinates: coordinates,
    latitudeStart: latitudeStart as number,
    longitudeStart: longitudeStart as number
  };
}
