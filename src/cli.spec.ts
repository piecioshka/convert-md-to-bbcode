import { afterEach, describe, expect, it, vi } from 'vitest';

import { parseArgs } from './cli.js';

afterEach(() => {
  vi.restoreAllMocks();
});

/** fail() prints to stderr and calls process.exit(1); both are mocked here. */
function expectFailure(argv: string[], message: string): void {
  const exit = vi.spyOn(process, 'exit').mockImplementation(() => {
    throw new Error('process.exit');
  });
  const stderr = vi
    .spyOn(process.stderr, 'write')
    .mockImplementation(() => true);
  expect(() => parseArgs(argv)).toThrow('process.exit');
  expect(exit).toHaveBeenCalledWith(1);
  expect(String(stderr.mock.calls[0]?.[0])).toContain(message);
}

describe('parseArgs', () => {
  it('defaults to stdin input and stdout output', () => {
    expect(parseArgs([])).toEqual({
      input: null,
      out: null,
      keepH1: false,
      pinecoders: false,
      help: false,
      version: false,
    });
  });

  it('parses the input file, --out, --keep-h1 and --pinecoders', () => {
    expect(
      parseArgs(['in.md', '--out', 'out.txt', '--keep-h1', '--pinecoders']),
    ).toEqual({
      input: 'in.md',
      out: 'out.txt',
      keepH1: true,
      pinecoders: true,
      help: false,
      version: false,
    });
  });

  it('accepts "-" as the stdin placeholder', () => {
    expect(parseArgs(['-']).input).toBe('-');
  });

  it('recognizes help and version in both forms', () => {
    expect(parseArgs(['--help']).help).toBe(true);
    expect(parseArgs(['-h']).help).toBe(true);
    expect(parseArgs(['--version']).version).toBe(true);
    expect(parseArgs(['-v']).version).toBe(true);
  });

  it('fails on --out without a value', () => {
    expectFailure(['--out'], '--out requires a file path');
  });

  it('fails on an unknown option', () => {
    expectFailure(['--nope'], 'unknown option: --nope');
  });

  it('fails on a second positional argument', () => {
    expectFailure(['a.md', 'b.md'], 'unexpected argument: b.md');
  });
});
