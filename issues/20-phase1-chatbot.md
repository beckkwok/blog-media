# Phase 1 — Manager Chatbot Agent (epic, public streaming)

Framework dep: rate-limiting (#3, open) — build app-level throttle workaround for v1 (e.g. per-IP 10 req/min in route), adopt framework fix when landed.

## 1.1 Read skills `listProjects`, `listExperience`
- `src/agents/skills/listProjects.ts`, `listExperience.ts`: `payload.find(... overrideAccess:false, user:ctx.user)`, `limit` clamped 1–50.
- Register in app `SKILLS`; `payload generate:types` + migrate (enum change).
- Test: `tests/unit/skills.unit.spec.ts` asserts `overrideAccess:false` + user passthrough.

## 1.2 Create A1 agent rows
- Seed: `User(type:Agent, role:manager-agent)` principal + `Agent(kind:streaming, runAccess:public, capabilities:[knowledge], tools:[searchKnowledge,listContent,getContent,listProjects,listExperience], safetyMode:enforce)`.
- Provision one MCP key per agent (seed, `overrideAccess:true`), print once.
- Test: key authenticates, keyless 401.

## 1.3 Chat widget (SSE)
- Floating widget calling `POST /api/agents/:id/stream`, renders `token` events, sends `sessionId`.
- Test: manual chat "What is on the menu/Beck's work?" returns grounded answer; `AgentRun` + `ChatMessage` rows created.

## 1.4 Guardrails for A1
- Add `Guardrails` rows: block disclosing non-public contact PII; keep defaults (cc/SSN/IBAN).
- Test: injection/personal-data probes flagged (`tests/int/guardrails.int.spec.ts` pattern).

## 1.5 Eval suite for A1
- `EvalCase`s: 3 correctness/contains + 2 tool-use + 2 safety (`expectFlagged:true`); `EvalRun` + `passThreshold`; `gateEnforced` on after baseline.
- Test: `runEvaluation` passes; failing run deactivates only when gate on.

## 1.6 Public hardening
- App throttle + `runAccess:public` review; verify `Provider.apiKey` never in output (mask tests).
- Test: e2e — validation 400, SSE content-type, audit trace per run.
