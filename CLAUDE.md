# CLAUDE.md — World Auto — Global Mobility Solution

Project facts and rules only; keep it short. Scope lives in `SPEC.md` (create it with `/kickoff` if missing), history and decisions in `DECISIONS.md`. The general standard — kickoff, build standard, security baseline, quality gate, ship-check — comes from the `ghani-standard` plugin (enabled in `.claude/settings.json`), so it is not repeated here.

## What this is
Plateforme d'import de pièces auto Chine → Algérie (FR / AR / EN).

## Stack and commands
- Stack: Next.js 16.0.0 · React 19.2.0 · Tailwind 4.1.0 · three.js 0.180.0
- Install: `npm ci`
- dev: `npm run dev`
- start: `npm run start`
- lint: `npm run lint`
- build: `npm run build`
- Env: copy `.env.example` to `.env.local`. Never commit `.env*`.
- Missing checks: no `typecheck`, `test` script yet, so the quality gate can't check those. Add them.

## Project rules
- None recorded yet. Add a line here whenever a project-specific rule comes up.

## Gotchas
- None recorded yet. One line each, with the fix.
