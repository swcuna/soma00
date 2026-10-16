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

## Approved reference and preferences

Use https://soma00-dexterity-demo.shanelai.chatgpt.site as the authoritative reference for soma00.com. Match its layout, typography, copy, assets, animations, video controls, and responsive behavior. Do not introduce a separate mobile design or force a desktop-width viewport. This supersedes the earlier fixed-width mobile request.

The site uses the demo's self-hosted Inter fonts, original media, responsive styles, scroll-driven opening, demonstration tabs, and full-film dialog. Keep keyboard tab navigation, reduced-motion handling, and playback controls working. Explain exact code/configuration changes when updating the site.

Build and deployment commands remain unchanged: `npm run build` and the existing GitHub-connected Vercel deployment. Application source is in `soma00-vercel/` within the GitHub repository.
