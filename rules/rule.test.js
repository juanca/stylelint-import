const rule = require('./rule.js');
const stylelint = require('stylelint');

function configuration(options) {
  return Object.assign({
    config: {
      plugins: ['./rule.js'],
      rules: {
        'import/rule': [true, {}],
      },
    },
    configBasedir: 'rules',
  }, options);
}

test('it has a name', () => {
  expect(rule.ruleName).toBe('import/rule');
});

test('rule parses correct import statements', () => {
  return stylelint.lint(configuration({
    files: require.resolve('../fixtures/passes.css'),
  })).then(function (resultObject) {
    const output = JSON.parse(resultObject.output);
    expect(output[0].warnings).toEqual([]);
  });
});

test('rule errors on missing files', () => {
  return stylelint.lint(configuration({
    files: require.resolve('../fixtures/fails-missing-file.css'),
  })).then(function (resultObject) {
    expect(resultObject.errored).toBe(true);

    const output = JSON.parse(resultObject.output);
    expect(output[0].warnings[0].severity).toBe('error');
  });
});

test('rule errors on missing extensions', () => {
  return stylelint.lint(configuration({
    files: require.resolve('../fixtures/fails-missing-extension.css'),
  })).then(function (resultObject) {
    expect(resultObject.errored).toBe(true);

    const output = JSON.parse(resultObject.output);
    expect(output[0].warnings[0].severity).toBe('error');
  });
});
