# Contributing to convert-md-to-bbcode

How to build, test and change the converter. For what it does and how to use it, see the [README](README.md). Issues and feature requests go to the [issues page](https://github.com/piecioshka/convert-md-to-bbcode/issues/).

## Getting started

Prerequisites: Node.js from `.nvmrc` (`lts/krypton`). The published package supports Node 20.19 and newer (`engines`).

```bash
git clone https://github.com/piecioshka/convert-md-to-bbcode
cd convert-md-to-bbcode
npm install
npm run build
```

`npm run build` compiles `src/` with `tsc` into `dist/` (JavaScript) and `types/` (declarations). The CLI in `bin/cli.js` imports from `dist/`, so build before running it from the working copy:

```bash
node bin/cli.js README.md --pinecoders
```

## Scripts

| Command                | What it does                                  |
| ---------------------- | --------------------------------------------- |
| `npm run build`        | compiles TypeScript into `dist/` and `types/` |
| `npm test`             | unit tests (Vitest)                           |
| `npm run test:watch`   | Vitest in watch mode                          |
| `npm run coverage`     | unit tests with a coverage report             |
| `npm run lint`         | ESLint                                        |
| `npm run format`       | Prettier over the whole repository            |
| `npm run format:check` | Prettier, check only                          |
| `npm run clear`        | removes `dist/`, `types/` and `coverage/`     |
| `npm run clear:all`    | also removes `node_modules/`                  |
| `npm run count`        | line count of the TypeScript sources          |

`prepack` clears and rebuilds, so `npm pack` always ships fresh output.

Before calling a change done:

```bash
npm run format:check && npm run lint && npm test
```

The husky pre-commit hook runs `npm test` and then lint-staged, which formats staged files with Prettier. `.vscode/launch.json` has a "Unit tests" configuration for debugging Vitest in VS Code.

## Project structure

- `src/index.ts` - the converter and the public API (`convertMarkdownToBBCode`)
- `src/cli.ts` - argument parsing, stdin and `--out` handling
- `src/*.spec.ts` - tests, next to the code they cover
- `bin/cli.js` - the executable, only imports `main` from `dist/cli.js` and calls it
- `demo/demo.tape` - the [VHS](https://github.com/charmbracelet/vhs) script behind `demo/demo.gif`; regenerate with `vhs demo/demo.tape`

## Design decisions

- The target dialect is exactly what TradingView's publish form accepts: `[b]`, `[i]`, `[s]`, `[pine]`, `[list]`, `[list=1]`, `[*]`, `[quote]`, `[url=...]`, `[image]`. There are no headers, tables or inline code in it, hence `[pine]` blocks for tables and ASCII art, and inline code mapped to `[b]`.
- The default is a faithful conversion: every heading becomes a plain `[b]` line and the H1 stays. The PineCoders styling (`█ [b]SECTION[/b]` sections, first H1 dropped) is opt-in through `style: 'pinecoders'` or `--pinecoders`; keep it that way.
- The package has zero runtime dependencies.

## CI

`.github/workflows/ci.yml` runs on every push and pull request on Node 20, 22 and 24: `npm ci`, `format:check`, `build`, `lint`, `test`.

## Conventions

- ESM everywhere: `"type": "module"`, relative imports carry the `.js` extension.
- Prettier formats every file.
- Commit messages in English, [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `chore:`). Version bumps are plain commits named after the version, like `1.0.0`.
