# blog-media — Phase Overview (app repo)

> Framework: `beckkwok/agent_enabled_cms` (do not fork framework code — compose it per `docs/building-applications.md`: *add, don't edit*).
> Framework issues filed: #14 scheduler (F1), #15 generic web-search (F2), #16 generic credentials (F3).
> Existing framework deps: #1/#4/#5 multi-agent, #6 human-in-loop, #3 rate-limit, #2 output policy, #7 eval metrics.

| Phase | Epic | Sub-issues | Can start now? |
|---|---|---|---|
| 0 | Scaffold portfolio+blog | 0.1–0.5 | Yes — no framework dep |
| 1 | Manager chatbot (public, streaming) | 1.1–1.6 | Yes — workaround for #3 (basic throttling in app) |
| 2 | IG Researcher (Tavily, scheduled) | 2.1–2.7 | Yes with workarounds; framework #14 + #15 are prerequisites for the *clean* version |
| 3 | Blog+IG Writer + auto-post | 3.1–3.7 | Yes with workarounds; framework #16 + #6 + #1/#4/#5 are prerequisites for the *clean* version |

Each phase file lists sub-issues in dependency order — do them one by one. Each sub-issue ends with its own test command.
When the `blog-media` GitHub repo is created, each sub-issue becomes one GitHub issue (title = heading).
