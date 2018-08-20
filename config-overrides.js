const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const rewireSass = require('react-app-rewire-scss');
const rewireMobX = require('react-app-rewire-mobx');

module.exports = function override(config, env) {
  config = injectBabelPlugin('jsx-display-if', config);
  config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config);
  config = rewireLess.withLoaderOptions({
    javascriptEnabled: true,
    modifyVars: { /* "@primary-color": "#1DA57A" */ },
  })(config, env);
  config = rewireSass(config, env);
  config = rewireMobX(config, env);
  return config;
};