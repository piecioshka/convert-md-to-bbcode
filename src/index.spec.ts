import { describe, expect, it } from 'vitest';

import { type ConvertOptions, convertMarkdownToBBCode } from './index.js';

const convert = (markdown: string, options: ConvertOptions = {}): string =>
  convertMarkdownToBBCode(markdown, options);

describe('inline formatting', () => {
  it('converts bold, italic and strikethrough', () => {
    expect(convert('**b** and *i* and _i2_ and ~~s~~')).toBe(
      '[b]b[/b] and [i]i[/i] and [i]i2[/i] and [s]s[/s]\n',
    );
  });

  it('converts inline code to [b] and protects its content', () => {
    expect(convert('use `a * b` here')).toBe('use [b]a * b[/b] here\n');
  });

  it('leaves snake_case identifiers and bare numbers untouched', () => {
    expect(convert('call snake_case_name with 300 bars')).toBe(
      'call snake_case_name with 300 bars\n',
    );
  });

  it('converts absolute links and degrades relative ones to text', () => {
    expect(convert('[a](https://example.com) and [b](./local.md)')).toBe(
      '[url=https://example.com]a[/url] and b\n',
    );
  });

  it('converts absolute images and drops relative ones', () => {
    expect(convert('![x](https://example.com/i.png)')).toBe(
      '[image]https://example.com/i.png[/image]\n',
    );
    expect(convert('before\n\n![x](./i.png)\n\nafter')).toBe(
      'before\n\nafter\n',
    );
  });

  it('keeps parentheses in link and image URLs', () => {
    expect(convert('[Foo](https://en.wikipedia.org/wiki/Foo_(bar))')).toBe(
      '[url=https://en.wikipedia.org/wiki/Foo_(bar)]Foo[/url]\n',
    );
    expect(convert('![x](https://example.com/a_(1).png)')).toBe(
      '[image]https://example.com/a_(1).png[/image]\n',
    );
  });

  it('converts bold with nested italic', () => {
    expect(convert('**a *b* c**')).toBe('[b]a [i]b[/i] c[/b]\n');
    expect(convert('__a _b_ c__')).toBe('[b]a [i]b[/i] c[/b]\n');
  });

  it('converts triple emphasis to bold plus italic', () => {
    expect(convert('***x***')).toBe('[b][i]x[/i][/b]\n');
  });

  it('keeps tags nested for emphasis touching a bold boundary', () => {
    expect(convert('**a *b***')).toBe('[b]a [i]b[/i][/b]\n');
    expect(convert('__a _b___')).toBe('[b]a [i]b[/i][/b]\n');
    expect(convert('***bold** italic*')).toBe('[i][b]bold[/b] italic[/i]\n');
  });

  it('degrades links and images with an empty URL', () => {
    expect(convert('see [a]() now')).toBe('see a now\n');
    expect(convert('before\n\n![x]()\n\nafter')).toBe('before\n\nafter\n');
  });

  it('honors backslash escapes', () => {
    expect(convert('\\*not italic\\*')).toBe('*not italic*\n');
    expect(convert('\\_not italic\\_')).toBe('_not italic_\n');
  });
});

describe('headings', () => {
  it('renders every heading as plain [b] and keeps the first H1 by default', () => {
    expect(convert('# Title')).toBe('[b]Title[/b]\n');
    expect(convert('## The idea')).toBe('[b]The idea[/b]\n');
    expect(convert('### Appearance')).toBe('[b]Appearance[/b]\n');
  });

  it('drops the first H1 with keepH1: false', () => {
    expect(convert('# Title\n\nText', { keepH1: false })).toBe('Text\n');
  });

  it('strips inline formatting inside headings instead of nesting tags', () => {
    expect(convert('## Test **x** and `y`')).toBe('[b]Test x and y[/b]\n');
    expect(convert('### With [link](https://example.com)')).toBe(
      '[b]With link[/b]\n',
    );
  });
});

describe('pinecoders style', () => {
  const pine = (markdown: string): string =>
    convert(markdown, { style: 'pinecoders' });

  it('renders H1/H2 as uppercased section headers', () => {
    expect(pine('## The idea')).toBe('█ [b]THE IDEA[/b]\n');
  });

  it('renders H3 and deeper as plain bold', () => {
    expect(pine('### Appearance')).toBe('[b]Appearance[/b]\n');
  });

  it('drops the first H1 by default', () => {
    expect(pine('# Title\n\nText')).toBe('Text\n');
  });

  it('keeps the first H1 with keepH1', () => {
    expect(
      convert('# Title\n\nText', { style: 'pinecoders', keepH1: true }),
    ).toBe('█ [b]TITLE[/b]\n\nText\n');
  });

  it('renders a second H1 as a section header', () => {
    expect(pine('# First\n\n# Second')).toBe('█ [b]SECOND[/b]\n');
  });
});

describe('blocks', () => {
  it('converts fenced code to [pine]', () => {
    expect(convert('```\nline1\nline2\n```')).toBe(
      '[pine]\nline1\nline2\n[/pine]\n',
    );
  });

  it('converts tables to [pine] and drops the separator row', () => {
    expect(convert('| A | B |\n| - | - |\n| 1 | 2 |')).toBe(
      '[pine]\n| A | B |\n| 1 | 2 |\n[/pine]\n',
    );
  });

  it('converts blockquotes to [quote]', () => {
    expect(convert('> one\n> two')).toBe('[quote]\none\ntwo\n[/quote]\n');
  });

  it('drops horizontal rules and collapses blank lines', () => {
    expect(convert('a\n\n---\n\nb')).toBe('a\n\nb\n');
  });
});

describe('lists', () => {
  it('converts unordered lists', () => {
    expect(convert('- one\n- two')).toBe('[list]\n[*]one\n[*]two\n[/list]\n');
  });

  it('converts ordered lists', () => {
    expect(convert('1. one\n2. two')).toBe(
      '[list=1]\n[*]one\n[*]two\n[/list]\n',
    );
  });

  it('nests lists with nested [list] tags', () => {
    expect(convert('1. one\n   - sub\n2. two')).toBe(
      '[list=1]\n[*]one\n[list]\n[*]sub\n[/list]\n[*]two\n[/list]\n',
    );
  });

  it('appends indented continuation lines to the open list', () => {
    expect(convert('- one\n  continued')).toBe(
      '[list]\n[*]one\ncontinued\n[/list]\n',
    );
  });

  it('keeps a loose list as one list', () => {
    expect(convert('- one\n\n- two')).toBe('[list]\n[*]one\n[*]two\n[/list]\n');
    expect(convert('1. one\n\n2. two')).toBe(
      '[list=1]\n[*]one\n[*]two\n[/list]\n',
    );
  });

  it('keeps the list open across a blank line before a continuation', () => {
    expect(convert('- one\n\n  continued')).toBe(
      '[list]\n[*]one\ncontinued\n[/list]\n',
    );
  });

  it('treats a 4-space indent as one nesting level', () => {
    expect(convert('- one\n    - sub')).toBe(
      '[list]\n[*]one\n[list]\n[*]sub\n[/list]\n[/list]\n',
    );
  });

  it('keeps siblings with the same indent on one level', () => {
    expect(convert('- a\n    - b\n    - c\n- d')).toBe(
      '[list]\n[*]a\n[list]\n[*]b\n[*]c\n[/list]\n[*]d\n[/list]\n',
    );
  });

  it('starts a new list when the marker type changes', () => {
    expect(convert('- a\n\n1. b')).toBe(
      '[list]\n[*]a\n[/list]\n[list=1]\n[*]b\n[/list]\n',
    );
    expect(convert('1. a\n- b')).toBe(
      '[list=1]\n[*]a\n[/list]\n[list]\n[*]b\n[/list]\n',
    );
  });
});

describe('document shape', () => {
  it('trims the edges and ends with a single newline', () => {
    expect(convert('\n\ntext\n\n\n')).toBe('text\n');
  });

  it('normalizes CRLF input', () => {
    expect(convert('a\r\n\r\nb')).toBe('a\n\nb\n');
  });

  it('returns a single newline for empty input', () => {
    expect(convert('')).toBe('\n');
  });

  it('closes an unterminated fence', () => {
    expect(convert('```\ncode')).toBe('[pine]\ncode\n[/pine]\n');
  });

  it('renders a second H1 like any other heading', () => {
    expect(convert('# First\n\n# Second')).toBe(
      '[b]First[/b]\n\n[b]Second[/b]\n',
    );
  });
});
