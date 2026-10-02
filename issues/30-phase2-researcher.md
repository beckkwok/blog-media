# Phase 2 — IG Research Agent, Tavily, scheduled (epic)

Final search decision: **Tavily** (swappable adapter for Exa/Brave later; framework F2 will generalize it).

## Framework prerequisites (clean version)
- **#14 Scheduler (F1, NEW, required)** — declarative cron for agent jobs. Without it, use workaround: manual "Run now" admin button + external cron (`cron-job.org` / `gh actions schedule`) hitting `POST /api/agents/:id/run`.
- **#15 Generic web-search skill (F2, NEW, required)** — framework `searchWeb`. Without it, build app-layer skill below and donate back.
- Nice-to-have: #7 eval metrics surface (track idea quality over time).

## Tavily cost estimate (weekly AI-education sweep)
Assumptions: 1 scheduled run/week; per run ~5 `search_depth:basic` searches + ~5 `extract` calls ≈ **10 credits/run** (advanced search = 2 credits; extract ≈ 1 credit/5 pages — rounded up).

| Cadence | Credits/mo | Cost |
|---|---|---|
| Weekly (planned v1) | ~40 | **$0** (free 1,000/mo) |
| 3×/week | ~120 | **$0** |
| Daily | ~300 | **$0** |
| Daily + advanced depth | ~600–900 | **$0** (still free tier) |
| Beyond 1,000/mo | 1,000+ | ~$8 / 1k credits PAYG ($30–$500 plans cheaper per credit) |

Verdict: **v1 cost = $0**. Set `TAVILY_API_KEY` + monthly credit alert at 70%; cap `limit<=5` in skill so one run can't burn budget.

## Sub-issues (in order)
### 2.1 `searchWeb` skill (Tavily-first, provider-swappable)
- `src/agents/skills/searchWeb.ts`: `{ query, limit<=5 }` → `{ results:[{title,url,snippet}] }`; `SEARCH_PROVIDER` env switch; missing-key → clear config error; never log key.
- Test: unit (limit clamp, key-missing) + int with `MOCK_SEARCH=1`.

### 2.2 `createIdeaDraft` / `getIdeaDraft` skills
- Write `status:proposed` only (allowlist in handler); `requiredRoles:['researcher']`; collection `requirePermission('research.write')`.
- Test: researcher principal writes ok; visitor principal denied.

### 2.3 A2 agent rows
- `User(type:Agent, role:researcher-agent)` + `Agent(kind:single-shot, runAccess:admin, tools:[searchWeb,createIdeaDraft])`; prompt: "3 topics/week, hook + why-now + 3 sources, save drafts, never publish".
- Test: admin run creates 1–3 `IdeaDraft(proposed)` + `AgentRun` trace.

### 2.4 `researchSweep` queue job + trigger
- Job: `runSingleShot(A2)`; v1 trigger = admin button + external cron docs; adopt #14 when landed.
- Test: enqueue → drains via `payload.jobs.run()` → drafts created.

### 2.5 Review UI (draft → approved/rejected)
- Admin list view on `IdeaDraft.status`; no code beyond Payload admin config.
- Test: flip one draft to `approved`, assert writer input ready.

### 2.6 Eval for A2
- Cases: tool-use (called `searchWeb` + `createIdeaDraft`), correctness (sources are URLs), safety (no PII in drafts).
- Test: `EvalRun.score >= threshold`.

### 2.7 Cost guardrail
- Per-run credit log field on `IdeaDraft` (`searchCredits`); alert if >200/run.
- Test: oversized `limit` clamped before API call.
