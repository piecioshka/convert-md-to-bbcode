import fs from 'node:fs';
import { createRequire } from 'node:module';

import { convertMarkdownToBBCode } from './index.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

type CliOptions = {
  input: string | null;
  out: string | null;
  keepH1: boolean;
  pinecoders: boolean;
  help: boolean;
  version: boolean;
};

function displayUsage(): void {
  console.log(`Usage: ${pkg.name} [input.md] [options]

Converts Markdown to BBCode. Reads stdin when no input file
(or "-") is given, writes to stdout by default.

Options:
  --out <file>   write the BBCode to a file instead of stdout
  --pinecoders   render H1/H2 as "█ [b]UPPERCASE[/b]" section lines and
                 drop the first H1 (the PineCoders publication style;
                 the publish form has its own title field)
  --keep-h1      keep the first H1 heading even with --pinecoders
  --version      print the version and exit
  --help         print this help and exit`);
}

function fail(message: string): never {
  process.stderr.write(`${pkg.name}: ${message}\n`);
  process.exit(1);
}

const FLAGS: Record<string, (options: CliOptions) => void> = {
  '--keep-h1': (options) => {
    options.keepH1 = true;
  },
  '--pinecoders': (options) => {
    options.pinecoders = true;
  },
  '--help': (options) => {
    options.help = true;
  },
  '-h': (options) => {
    options.help = true;
  },
  '--version': (options) => {
    options.version = true;
  },
  '-v': (options) => {
    options.version = true;
  },
};

export function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    input: null,
    out: null,
    keepH1: false,
    pinecoders: false,
    help: false,
    version: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i] ?? '';
    const flag = FLAGS[arg];
    if (arg === '--out') {
      const value = argv[++i];
      if (value === undefined) fail('--out requires a file path');
      options.out = value;
    } else if (flag) {
      flag(options);
    } else if (arg.startsWith('-') && arg !== '-') {
      fail(`unknown option: ${arg}`);
    } else if (options.input === null) {
      options.input = arg;
    } else {
      fail(`unexpected argument: ${arg}`);
    }
  }
  return options;
}

export async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    displayUsage();
    return;
  }
  if (options.version) {
    console.log(pkg.version);
    return;
  }

  let source: string;
  try {
    source =
      options.input && options.input !== '-'
        ? fs.readFileSync(options.input, 'utf8')
        : fs.readFileSync(0, 'utf8');
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }

  const bbcode = convertMarkdownToBBCode(source, {
    style: options.pinecoders ? 'pinecoders' : 'plain',
    // Only an explicit --keep-h1 overrides the style's own default.
    ...(options.keepH1 ? { keepH1: true } : {}),
  });
  writeOutput(options.out, bbcode);
}

function writeOutput(out: string | null, bbcode: string): void {
  if (!out) {
    process.stdout.write(bbcode);
    return;
  }
  try {
    fs.writeFileSync(out, bbcode);
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  }
}
