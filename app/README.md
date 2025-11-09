# TrailSense - Nuxt Web App

This folder contains the Nuxt frontend and the small backend API (Nitro server) used by the web app. It's intentionally small, the frontend talks to a set of server routes included under `server/api`.

## Prerequisites

- Node.js (16+ recommended)
- We recommend using `npm`, but `yarn` or `pnpm` should also work.

## Setup

Install dependencies:

```bash
npm install
```

Set up the database (Cloudflare D1):

```bash
# Apply migrations
npm run apply-migrations:dev

# Load demo data (optional)
npm run seed:generate
npm run apply-seeds:dev
```

## Development server

Start the development server (default: http://localhost:3000):

```bash
npm run dev
```

## Production

Build for production and preview locally:

```bash
# build
npm run build

# preview
npm run preview
```

## Backend routes (short list)

The project exposes a small API under `server/api`. Key routes:

- `GET /api/nodes`

  - Returns a list of nodes (trail sensors) with today's estimated activations.

- `GET /api/nodes/:id/activities?period=&date=`

  - Returns activity buckets for a node.
  - Query params:
    - `period` — `day` (default), `week`, or `month`
    - `date` — ISO date (defaults to today)

- `POST /api/nodes/:id/activities`

  - Insert a new activity record for a node (used by hardware devices to upload BLE/WiFi counts, temperature, etc.).

- `GET /api/trails?bounds=lat1,lon1,lat2,lon2`

  - Returns trails whose start points are within the provided bounding box. `pathData` is returned as a polyline.

- `POST /api/import`

  - Triggers an internal import worker (used for project data tasks).

These routes are implemented in `server/api/*`, open those files for exact parameters and response shapes.

## Notes

- The frontend is a Nuxt app and the backend API runs with Nitro inside the same project. This makes local development simple, run the dev server and both frontend and API routes are available.
- Keep the documentation short and check the `server/api` files for details if you need exact request/response formats.

## See also

- Project root README: `../README.md`
- Hardware docs: `../hardware/esp32/README.md`
