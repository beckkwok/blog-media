# Phase 3 — Writer Agent + IG auto-post (epic)

Handoff design (v1, no framework multi-agent needed): **shared-collection pipeline** — A2 writes `IdeaDraft(approved)` → hook enqueues `writerJob` → A3 writes `BlogPosts(draft)` + `SocialPosts(draft)` → human approves → `publishInstagram` job. Direct agent-as-tool comes with framework orchestration later.

## Framework prerequisites (clean version)
- **#16 Generic credentials (F3, NEW, required)** — IG long-lived token + refresh + Tavily key vaulting. Workaround v1: env `IG_ACCESS_TOKEN` + manual 60-day refresh runbook.
- **#6 Human-in-the-loop (open, required)** — formal approve-before-publish gate. Workaround v1: `status` allowlist (`draft→approved→published`) + `requiredRoles` + collection perms.
- **#1 / #4 / #5 Multi-agent orchestration (open, required for direct delegation)** — session/handoff model, agent-as-tool, workflow executor. Workaround v1: collection-handoff above (no agent calling another agent).
- Nice-to-have: #2 semantic output policy (brand-toxicity check), #7 eval metrics.

## Sub-issues (in order)
### 3.1 Draft skills `createBlogDraft`, `createSocialDraft`
- Handlers force `status:draft`, validate caption <2200 chars, hashtags<=30; `requiredRoles:['writer']`; collections `requirePermission('content.write'/'social.write')`.
- Test: writer writes drafts; A2 principal denied; `status:published` rejected by handler.

### 3.2 `getIdeaDraft` skill
- Read approved idea + sources by id; `overrideAccess:false`.
- Test: unpublished/private ideas not leaked across principals.

### 3.3 A3 agent rows
- `User(type:Agent, role:writer-agent)` + `Agent(kind:single-shot, runAccess:admin, capabilities:[knowledge], tools:[getIdeaDraft,searchKnowledge,createBlogDraft,createSocialDraft])`; prompt: "600-word blog + 1 IG caption + imagePrompt, drafts only".
- Test: approved idea → 1 blog draft + 1 social draft + trace.

### 3.4 `writerJob` pipeline job
- Trigger: `IdeaDraft.afterChange` → `status==approved` enqueues `writerJob { ideaId }`; idempotent (skip if draft exists).
- Test: approve → job drains → drafts appear; double-approve creates no dupes.

### 3.5 Review → publish (blog)
- Human sets `BlogPosts:published` in admin; writer never sets it.
- Test: writer principal cannot publish directly (perm denied).

### 3.6 `publishInstagram` skill + job (Meta Graph API)
- `POST /{ig-user}/media` (caption + imageUrl) → `.../media_publish`; store `igMediaId`, set `published`; only on `SocialPost.status==approved`; token from env (adopt #16 later); never in `Agent.tools` for A1/A2.
- Test: mocked Graph API int test; failure → `failed` + error logged, no silent publish.

### 3.7 Eval + brand guardrails
- Cases: correctness (blog mentions sources), tool-use (both draft skills called), safety (no secret/PII, caption length).
- `Guardrails` output `block` e.g. "guaranteed gains" claims if needed; Test: eval gate + red-team probes.
