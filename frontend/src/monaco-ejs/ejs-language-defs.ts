import * as monaco from 'monaco-editor-core';

const EMPTY_ELEMENTS: string[] = [
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'menuitem',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
];
const POSTFIX_SYMBOLS = ['', '-', '_'];
const PREFIX_SYMBOLS = ['=', ...POSTFIX_SYMBOLS];
const brackets = PREFIX_SYMBOLS.flatMap((x) =>
  POSTFIX_SYMBOLS.map(
    (y) => [`<%${x}`, `${y}%>`] as monaco.languages.CharacterPair,
  ),
);
const reservedJsxTags = ['Search', 'Component'];
const jsxRegex = new RegExp(`(<)(${reservedJsxTags.join('|')})`);
//console .log(jsxRegex);
export const conf: monaco.languages.LanguageConfiguration = {
  wordPattern: /(-?\d*\.\d\w*)|([^`~!@$^&*()=+[{\]}\\|;:'",.<>/\s]+)/g,

  comments: {
    blockComment: ['<!--', '-->'],
  },

  brackets: [['<!--', '-->'], ['<', '>'], ['{', '}'], ['(', ')'], ...brackets],

  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
  ],

  surroundingPairs: [
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '<', close: '>' },
  ],

  onEnterRules: [
    {
      beforeText: new RegExp(
        `<(?!(?:${EMPTY_ELEMENTS.join(
          '|',
        )}))([_:\\w][_:\\w-.\\d]*)([^/>]*(?!/)>)[^<]*$`,
        'i',
      ),
      afterText: /^<\/([_:\w][_:\w-.\d]*)\s*>$/i,
      action: { indentAction: monaco.languages.IndentAction.IndentOutdent },
    },
    {
      beforeText: new RegExp(
        `<(?!(?:${EMPTY_ELEMENTS.join(
          '|',
        )}))(\\w[\\w\\d]*)([^/>]*(?!/)>)[^<]*$`,
        'i',
      ),
      action: { indentAction: monaco.languages.IndentAction.Indent },
    },
  ],

  folding: {
    markers: {
      start: new RegExp('^\\s*<!--\\s*#region\\b.*-->'),
      end: new RegExp('^\\s*<!--\\s*#endregion\\b.*-->'),
    },
  },
};

export const language = {
  defaultToken: '',
  tokenPostfix: '.ejs',
  ignoreCase: true,

  ejsKeywords: ['if', 'else', 'includes', 'true', 'false'],
  reservedJsxTags,

  tokenizer: {
    root: [
      { include: 'ejsEmbeddedBegin' },
      // { include: 'jsx' },
      { include: 'html' },
      [/[^<]+/],
    ],

    jsx: [[jsxRegex, 'keyword.jsx'], [/\/?>/, 'keyword.jsx', '@pop'], [/\s*/]],

    html: [
      [/<!DOCTYPE/, 'metatag', '@doctype'],
      [/<!--/, 'comment', '@comment'],
      [
        /(<)((?:[\w-]+:)?[\w-]+)(\s*)(\/>)/,
        ['delimiter', 'tag', '', 'delimiter'],
      ],
      [/(<)(script)/, ['delimiter', { token: 'tag', next: '@script' }]],
      [/(<)(style)/, ['delimiter', { token: 'tag', next: '@style' }]],
      [
        /(<)((?:[\w-]+:)?[\w-]+)/,
        {
          cases: {
            // '$S2 == @reservedJsxTags': { token: 'keyword.jsx' },
            '@default': { token: 'tag', next: '@otherTag' },
          },
        },
      ],
      [
        /(<\/)((?:[\w-]+:)?[\w-]+)/,
        ['delimiter', { token: 'tag', next: '@otherTag' }],
      ],
      [/</, 'delimiter'],
    ],

    ejsEmbeddedBegin: [
      [/<(%?[#])/, 'comment', '@ejsComments'],
      [/<([%?][_=-]?)/, { token: 'metatag', next: '@ejsEmbeddedEnd' }],
    ],

    ejsEmbeddedEnd: [
      [/(\s*model)/, 'keyword.ejs'],
      [/([_-]?[%?])>/, { token: 'metatag', next: '@pop' }],
    ],

    ejsComments: [
      [/(%?)>/, 'comment', '@pop'],
      [/./, 'comment'],
    ],

    doctype: [
      [/[^>]+/, 'metatag.content'],
      [/>/, 'metatag', '@pop'],
    ],

    comment: [
      [/-->/, 'comment', '@pop'],
      [/[^-]+/, 'comment.content'],
      [/./, 'comment.content'],
    ],

    otherTag: [
      [/\/?>/, 'delimiter', '@pop'],
      [/"([^"]*)"/, 'attribute.value'],
      [/'([^']*)'/, 'attribute.value'],
      [/[\w-]+/, 'attribute.name'],
      [/=/, 'delimiter'],
      [/[ \t\r\n]+/], // whitespace
    ],

    // -- BEGIN <script> tags handling

    // After <script
    script: [
      [/type/, 'attribute.name', '@scriptAfterType'],
      [/"([^"]*)"/, 'attribute.value'],
      [/'([^']*)'/, 'attribute.value'],
      [/[\w-]+/, 'attribute.name'],
      [/=/, 'delimiter'],
      [
        />/,
        {
          token: 'delimiter',
          next: '@scriptEmbedded',
          nextEmbedded: 'text/javascript',
        },
      ],
      [/[ \t\r\n]+/], // whitespace
      [
        /(<\/)(script\s*)(>)/,
        ['delimiter', 'tag', { token: 'delimiter', next: '@pop' }],
      ],
    ],

    // After <script ... type
    scriptAfterType: [
      [/=/, 'delimiter', '@scriptAfterTypeEquals'],
      [
        />/,
        {
          token: 'delimiter',
          next: '@scriptEmbedded',
          nextEmbedded: 'text/javascript',
        },
      ], // cover invalid e.g. <script type>
      [/[ \t\r\n]+/], // whitespace
      [/<\/script\s*>/, { token: '@rematch', next: '@pop' }],
    ],

    // After <script ... type =
    scriptAfterTypeEquals: [
      [
        /"([^"]*)"/,
        { token: 'attribute.value', switchTo: '@scriptWithCustomType.$1' },
      ],
      [
        /'([^']*)'/,
        { token: 'attribute.value', switchTo: '@scriptWithCustomType.$1' },
      ],
      [
        />/,
        {
          token: 'delimiter',
          next: '@scriptEmbedded',
          nextEmbedded: 'text/javascript',
        },
      ], // cover invalid e.g. <script type=>
      [/[ \t\r\n]+/], // whitespace
      [/<\/script\s*>/, { token: '@rematch', next: '@pop' }],
    ],

    // After <script ... type = $S2
    scriptWithCustomType: [
      [
        />/,
        {
          token: 'delimiter',
          next: '@scriptEmbedded.$S2',
          nextEmbedded: '$S2',
        },
      ],
      [/"([^"]*)"/, 'attribute.value'],
      [/'([^']*)'/, 'attribute.value'],
      [/[\w-]+/, 'attribute.name'],
      [/=/, 'delimiter'],
      [/[ \t\r\n]+/], // whitespace
      [/<\/script\s*>/, { token: '@rematch', next: '@pop' }],
    ],

    scriptEmbedded: [
      [/<\/script/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],
      [/[^<]+/, ''],
    ],

    // -- END <script> tags handling

    // -- BEGIN <style> tags handling

    // After <style
    style: [
      [/type/, 'attribute.name', '@styleAfterType'],
      [/"([^"]*)"/, 'attribute.value'],
      [/'([^']*)'/, 'attribute.value'],
      [/[\w-]+/, 'attribute.name'],
      [/=/, 'delimiter'],
      [
        />/,
        {
          token: 'delimiter',
          next: '@styleEmbedded',
          nextEmbedded: 'text/css',
        },
      ],
      [/[ \t\r\n]+/], // whitespace
      [
        /(<\/)(style\s*)(>)/,
        ['delimiter', 'tag', { token: 'delimiter', next: '@pop' }],
      ],
    ],

    // After <style ... type
    styleAfterType: [
      [/=/, 'delimiter', '@styleAfterTypeEquals'],
      [
        />/,
        {
          token: 'delimiter',
          next: '@styleEmbedded',
          nextEmbedded: 'text/css',
        },
      ], // cover invalid e.g. <style type>
      [/[ \t\r\n]+/], // whitespace
      [/<\/style\s*>/, { token: '@rematch', next: '@pop' }],
    ],

    // After <style ... type =
    styleAfterTypeEquals: [
      [
        /"([^"]*)"/,
        { token: 'attribute.value', switchTo: '@styleWithCustomType.$1' },
      ],
      [
        /'([^']*)'/,
        { token: 'attribute.value', switchTo: '@styleWithCustomType.$1' },
      ],
      [
        />/,
        {
          token: 'delimiter',
          next: '@styleEmbedded',
          nextEmbedded: 'text/css',
        },
      ], // cover invalid e.g. <style type=>
      [/[ \t\r\n]+/], // whitespace
      [/<\/style\s*>/, { token: '@rematch', next: '@pop' }],
    ],

    // After <style ... type = $S2
    styleWithCustomType: [
      [
        />/,
        { token: 'delimiter', next: '@styleEmbedded.$S2', nextEmbedded: '$S2' },
      ],
      [/"([^"]*)"/, 'attribute.value'],
      [/'([^']*)'/, 'attribute.value'],
      [/[\w-]+/, 'attribute.name'],
      [/=/, 'delimiter'],
      [/[ \t\r\n]+/], // whitespace
      [/<\/style\s*>/, { token: '@rematch', next: '@pop' }],
    ],

    styleEmbedded: [
      [/<\/style/, { token: '@rematch', next: '@pop', nextEmbedded: '@pop' }],
      [/[^<]+/, ''],
    ],

    // -- END <style> tags handling
  },
} as monaco.languages.IMonarchLanguage;
