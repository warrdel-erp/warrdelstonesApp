module.exports = {
  arrowParens: 'avoid',
  bracketSameLine: true,
  bracketSpacing: true,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
  printWidth: 100,
  useTabs: false,
  quoteProps: 'as-needed',
  jsxSingleQuote: false,
  endOfLine: 'lf',
  embeddedLanguageFormatting: 'auto',
  overrides: [
    {
      files: '*.json',
      options: {
        singleQuote: false,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
  ],
};
