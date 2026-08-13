<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **LyraRPGGameplayAbility** (12052 symbols, 19415 relationships, 294 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> Index stale? Run `node .gitnexus/run.cjs analyze` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? `npx gitnexus analyze` (npm 11 crash → `npm i -g gitnexus`; #1939).

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows. For regression review, compare against the default branch: `detect_changes({scope: "compare", base_ref: "master"})`.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `query({search_query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `context({name: "symbolName"})`.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method without first running `impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit changes without running `detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/LyraRPGGameplayAbility/context` | Codebase overview, check index freshness |
| `gitnexus://repo/LyraRPGGameplayAbility/clusters` | All functional areas |
| `gitnexus://repo/LyraRPGGameplayAbility/processes` | All execution flows |
| `gitnexus://repo/LyraRPGGameplayAbility/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |
| Work in the Private area (391 symbols) | `.claude/skills/generated/private/SKILL.md` |
| Work in the GameFeatures area (138 symbols) | `.claude/skills/generated/gamefeatures/SKILL.md` |
| Work in the Settings area (129 symbols) | `.claude/skills/generated/settings/SKILL.md` |
| Work in the Public area (95 symbols) | `.claude/skills/generated/public/SKILL.md` |
| Work in the Player area (91 symbols) | `.claude/skills/generated/player/SKILL.md` |
| Work in the Character area (76 symbols) | `.claude/skills/generated/character/SKILL.md` |
| Work in the Weapons area (58 symbols) | `.claude/skills/generated/weapons/SKILL.md` |
| Work in the Widgets area (58 symbols) | `.claude/skills/generated/widgets/SKILL.md` |
| Work in the CustomSettings area (55 symbols) | `.claude/skills/generated/customsettings/SKILL.md` |
| Work in the AbilitySystem area (53 symbols) | `.claude/skills/generated/abilitysystem/SKILL.md` |
| Work in the Teams area (43 symbols) | `.claude/skills/generated/teams/SKILL.md` |
| Work in the IndicatorSystem area (41 symbols) | `.claude/skills/generated/indicatorsystem/SKILL.md` |
| Work in the Utilities area (41 symbols) | `.claude/skills/generated/utilities/SKILL.md` |
| Work in the GameModes area (41 symbols) | `.claude/skills/generated/gamemodes/SKILL.md` |
| Work in the Cosmetics area (38 symbols) | `.claude/skills/generated/cosmetics/SKILL.md` |
| Work in the Input area (36 symbols) | `.claude/skills/generated/input/SKILL.md` |
| Work in the Abilities area (30 symbols) | `.claude/skills/generated/abilities/SKILL.md` |
| Work in the System area (27 symbols) | `.claude/skills/generated/system/SKILL.md` |
| Work in the UI area (26 symbols) | `.claude/skills/generated/ui/SKILL.md` |
| Work in the Camera area (24 symbols) | `.claude/skills/generated/camera/SKILL.md` |

<!-- gitnexus:end -->
