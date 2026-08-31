# convert-md-to-bbcode

@MEMORY.md

## What this is

A zero-dependency CLI and library that converts Markdown to BBCode ([b], [i], [s], [pine], [list], [list=1], [*], [quote], [url=...], [image]). Originally written for publishing Pine Script indicator descriptions, generic enough for any BBCode destination.

## Layout

- `src/` holds every bit of logic, including `src/cli.ts`
- `bin/cli.js` only imports and calls, one file per declared binary
- `src/*.spec.ts` sits next to the code it tests
- `tmp/` takes logs, screenshots and throwaway scripts, and is ignored by git

## Conventions

- ESM everywhere: `"type": "module"`, relative imports carry the `.js` extension
- Prettier formats every file, `npm run format:check` guards it in CI
- Commit messages in English, Conventional Commits, no `Co-Authored-By`

## Before calling a task done

```bash
npm run format:check && npm run lint && npm test
```
