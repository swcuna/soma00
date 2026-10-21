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

Use https://soma00-dexterity-demo.shanelai.chatgpt.site as the authoritative reference for soma00.com. Preserve its desktop visual identity, typography, copy, assets, animations, and video controls. Adapt the mobile layout intentionally for readable sizing, full video framing, comfortable touch controls, and balanced spacing. Mobile usability takes precedence over copying the demo exactly. Never force a desktop-width viewport. Every website change must include mobile layout verification at narrow and wide phone widths, plus a desktop regression check. This supersedes the earlier instruction to copy the demo’s mobile layout exactly.

The site uses the demo's self-hosted Inter fonts, original media, responsive styles, scroll-driven opening, and full-film dialog. The three demonstration players expand from one wide composition into three columns on desktop and stack on mobile. Below them, the simulation film expands slightly from inset to edge-to-edge without letterboxing, followed by the closing headline's one-time typing animation. Keep keyboard access, reduced-motion handling, and playback controls working. Explain exact code/configuration changes when updating the site.

Build and deployment commands remain unchanged: `npm run build` and the existing GitHub-connected Vercel deployment. Application source is in `soma00-vercel/` within the GitHub repository.

## Original-quality simulation film

The simulation film is the original 1920×1080, 25 fps MP4 (106,336,612 bytes), without re-encoding. It exceeds GitHub's regular per-file size limit, so `assets/media/simulation/` stores three binary parts and a SHA-256 manifest. `scripts/prepare-media.mjs` assembles and verifies the exact original at `public/media/simulation.mp4`; that generated file is ignored by Git.

`npm run dev` and `npm run build` prepare it automatically. You can also run `npm run prepare:media` directly. Vercel's Git-connected build needs no extra environment variables or downloads. When replacing the film, regenerate the parts and manifest together; the build fails if the assembled checksum does not match.
