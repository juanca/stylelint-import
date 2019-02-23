const rule = require('./rule.js');

test('it has a name', () => {
  expect(rule.ruleName).toBe('import/rule');
});
