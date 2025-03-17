module.exports = {
  extends: ['@commitlint/config-conventional'],
  // Allow empty subject
  'subject-empty': [0, 'never'],
  // Allow types like 'feature' and others
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'dev',
        'stg',
        'prod',
        'seed',
        'build',
        'release',
        'cnc',
        'docs',
        'feature',
        'fix',
        'perf',
        'refactor',
        'revert',
        'test',
        'chore',
        'style',
      ],
    ],
  },
};
