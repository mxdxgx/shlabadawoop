module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'ci',
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'improve',
        'perf',
        'test',
        'revert',
        'temp',
      ],
    ],
  },
};
