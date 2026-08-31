# Memory

Facts about THIS repository: architecture, traps, decisions that the code and git history do not already state. Facts about the user, or preferences that span projects, belong in the shared memory file instead.

## Rules

- One fact per bullet, format: `- [YYYY-MM-DD] [category] fact`
- Categories: `project`, `reference`, `preference`
- Check for an existing entry before adding one, update instead of duplicating
- Delete a fact once it stops being true
- Newest entries first

## Facts

- [2026-08-31] [project] The PineCoders publication styling (`█ [b]UPPERCASE[/b]` H1/H2 sections + dropping the first H1) is OPT-IN: `style: 'pinecoders'` / CLI `--pinecoders` (`--keep-h1` restores the H1 within that style). The default is a faithful conversion: every heading becomes plain `[b]text[/b]` and the H1 stays. Decided 2026-08-31 on the user's request (the default must not add custom styling behaviors) - do not make the styling default again.
- [2026-08-31] [project] The BBCode target dialect is exactly what TradingView's publish form accepts (per pine-script-docs "Publishing scripts"): [b] [i] [s] [pine] [list] [list=1] [*] [quote] [url=...] [image]. No headers, no tables, no inline code - hence [pine] blocks for tables/ASCII art, and inline code mapped to [b]. Started 2026-08-31 as a port of `tools/md-to-bbcode.mjs` from `tradingview-pine-scripts` (removed there in the same move).
