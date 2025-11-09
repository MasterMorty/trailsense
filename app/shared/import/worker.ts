import {drizzle, DrizzleD1Database} from "drizzle-orm/d1";
import StreamArray from 'stream-json/streamers/StreamArray';
import * as fs from "node:fs";
import pkg from '@googlemaps/polyline-codec';


import * as schema from '../db/schema';
import path from 'path';
import {fileURLToPath} from 'url';

const {encode} = pkg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const {trails} = schema;

const JSON_FILE_PATH = path.join(__dirname, '..', '..', '..', 'data', 'tours.json');
const BATCH_SIZE = 1;

export const workWorkWork = async (db: DrizzleD1Database) => {
  let batch = [];
  let totalProcessed = 0;

  const fileStream = fs.createReadStream(JSON_FILE_PATH);

  const jsonStream = StreamArray.withParser();
  const processingStream = fileStream.pipe(jsonStream);

  try {
    for await (const {value: trail} of processingStream) {
      try {
        const geoData = JSON.parse(trail.geo);
        const rawGeoString = geoData?.geometry?.value;

        if (!rawGeoString) continue;

        const coordinates = parseCoordinateString(rawGeoString);
        const encodedPathData = encode(coordinates.coordinates!, 5);

        batch.push({
          id: trail.id,
          name: trail.title,
          pathData: encodedPathData,
          latitudeStart: coordinates.latitudeStart,
          longitudeStart: coordinates.longitudeStart
        });

        totalProcessed++;

        if (batch.length >= BATCH_SIZE) {
          console.log(`Processing - inserted ${totalProcessed} records.`);
          await db.insert(trails).values(batch);
          batch = [];
        }

      } catch (err) {
        console.error(`Error processing entry`, err);
      }
    }

    if (batch.length > 0) {
      console.log(`Inserting final ${batch.length} records...`);
      await db.insert(trails).values(batch);
    }

    console.log(`Total records processed: ${totalProcessed}`);

  } catch (err) {
    console.error('Error during stream processing:', err);
  }

  return;
}

const parseCoordinateString = (geoString: string) => {
  const numbers = geoString
    .split(' ')
    .filter(Boolean)
    .map(Number);

  const coordinates = [];

  if (numbers.length === 0 || numbers.length % 2 !== 0) {
    return {};
  }

  for (let i = 0; i < numbers.length; i += 2) {
    coordinates.push([
      numbers[i],
      numbers[i + 1]
    ]);
  }
  return {
    coordinates: coordinates as unknown as number[][],
    latitudeStart: numbers[0],
    longitudeStart: numbers[1],
  }
}