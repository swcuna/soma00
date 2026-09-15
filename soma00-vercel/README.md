# SOMA00 — Vercel-ready source

This is a standalone Next.js website, including the logo, photos, and videos. No environment variables, database, Sites account, or Cloudflare configuration are required.

## Deploy from your computer

Extract this ZIP and open a terminal inside the `soma00-vercel` folder. Run:

```sh
npx vercel --prod
```

Sign in to Vercel if prompted and accept the detected Next.js defaults. Vercel installs dependencies and builds the site for you.

## Deploy using the Vercel dashboard

Upload the contents of this folder to a GitHub repository, then import that repository in Vercel. Use:

- Framework preset: Next.js (automatically detected)
- Root directory: repository root (the directory containing package.json)
- Build command: npm run build (default)
- Output directory: default
- Environment variables: none

This ZIP is a source package; extract it before using the CLI or adding its files to GitHub.

## Local development

```sh
npm ci
npm run dev
```

## Edit the site

- `app/page.tsx`: content and layout
- `app/globals.css`: styling
- `app/layout.tsx`: page metadata and fonts
- `public/`: logo, photos, and videos

The hero video autoplays and loops with muted audio. Video controls allow visitors to pause or enable sound.
