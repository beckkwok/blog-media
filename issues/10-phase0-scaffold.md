# Phase 0 — Scaffold portfolio + blog (epic)

No framework dependency. Goal: empty `blog-media/` → running site composing AACMS.

## 0.1 Compose framework + boot
- Import framework `payload.config.ts` collections + add app collections below (boot-time composition, `payload generate:types`).
- `cp .env.example .env`, `pnpm install`, `pnpm dev`, `npx tsx scripts/seed.ts` (framework baseline).
- Test: `pnpm test:unit`.

## 0.2 App collections `Experience`, `Projects`
- `src/collections/Experience.ts`, `Projects.ts`: public `read:()=>true`, writes `requirePermission('content.write')`; add `PERMISSIONS` keys in app layer only.
- Migration: `payload migrate:create`; register in config.
- Test: create 2 rows via admin, `GET /api/projects` returns them.

## 0.3 App collections `IdeaDrafts`, `SocialPosts`
- `IdeaDrafts { topic, summary, sources[{url,title}], angle, status: proposed/approved/rejected }`, `SocialPosts { idea->, caption, hashtags, imagePrompt, status: draft/approved/published, igMediaId }`.
- Write perms `research.write` / `social.write` (app-added keys, granted to agent roles only).
- Test: anonymous read denied where appropriate; admin write ok.

## 0.4 Frontend pages
- `/`, `/about`, `/experience`, `/projects[/slug]`, `/blog[/slug]` under `src/app/(frontend)/` (ordinary Next.js; reuse framework `Nav`).
- Test: `pnpm dev`, visit each route with seeded data.

## 0.5 Seed personal content
- Extend `scripts/seed.ts` (app copy): bio + 2 projects + experience into `Knowledge(visibility:public)` + collections above.
- Test: reseed on clean DB succeeds; no framework seed files edited.
