const index = require('./index.js');

test('it exports a single rule', () => {
  expect(index.length).toEqual(1);
});

test('it exports the rule', () => {
  expect(index[0].ruleName).toBe('import/rule');
});
