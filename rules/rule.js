const fs = require('fs');
const path = require('path');
const stylelint = require('stylelint');

const messages = stylelint.utils.ruleMessages('import/rule', {
  expected: (filePath) => `Unable to find ${filePath}`,
});


module.exports = stylelint.createPlugin('css-modules/composed-class-names', (primaryOption, secondaryOptionObject) => {
  const options = secondaryOptionObject || { resolve: undefined };
  const resolve = options.resolve || { alias: {}, modules: [] };
  const aliasMap = resolve.alias || {};
  const aliases = Object.keys(aliasMap);
  const modules = resolve.modules || [];

  function resolveFilePath(contextPath, filePath) {
    if (filePath[0] === '.') {
      return path.join(contextPath, filePath);
    } else {
      // Copy webpack resolution algorithm -- is this a module I can just import?
      let resolvedFilePath = filePath;
      const rootDirectory = resolvedFilePath.split(path.sep)[0];
      const rootAlias = aliases.find(alias => alias === rootDirectory);

      if (rootAlias) {
        resolvedFilePath = path.join(aliasMap[rootAlias], ...resolvedFilePath.split(path.sep).slice(1))
        if (fs.existsSync(resolvedFilePath)) {
          return resolvedFilePath;
        }
      }

      resolvedFilePath = modules
        .map(module => path.join(module, resolvedFilePath))
        .find(maybePath => fs.existsSync(maybePath));

      return resolvedFilePath || filePath;
    }
  }


  return (root, result) => {
    const contextPath = path.dirname(result.opts.from);

    root.walkAtRules('import', (atRule) => {
      const filePath = resolveFilePath(contextPath, atRule.params.slice(1, -1));

      if (!fs.existsSync(filePath)) {
        stylelint.utils.report({
          message: messages.expected(filePath),
          node: atRule,
          result: result,
          ruleName: 'import/rule',
        });
      }
    });
  };
});

module.exports.ruleName = 'import/rule';
