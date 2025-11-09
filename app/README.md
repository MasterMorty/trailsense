# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Demo data generation

Use the bundled generator to create realistic demo data before applying the SQL seed:

# Always generates one node per curated trail.
npm run seed:generate -- --days=30 --global-traffic=1.1
npm run apply-seeds:dev
```

Available flags:

- `--days` — number of full days to backfill in 5-minute slots (default `30`).
- `--global-traffic` — multiplies overall visitor intensity.
- `--busy-factor` / `--calm-factor` — tweak how much busier or calmer the most/least visited nodes become.
- `--slot-minutes`, `--max-visitors`, `--seed`, `--output` — advanced controls for cadence, caps, deterministic output, and destination file.
- `--activities-file` — optional TSV list (defaults to `db/seeds/data.txt`) converted into explicit `activities` inserts.

The generated file replaces `db/seeds/demo.sql`; pass any of the flags above to tailor scenarios, then execute the regular `apply-seeds` command to load the data into your local D1 instance.
