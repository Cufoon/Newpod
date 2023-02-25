const env = require('./env');

module.exports = () => ({
  $assets: env.SOURCE_DIR('assets'),
  $components: env.SOURCE_DIR('components'),
  $hooks: env.SOURCE_DIR('hooks'),
  $pages: env.SOURCE_DIR('pages'),
  $service: env.SOURCE_DIR('service'),
  $src: env.SOURCE_DIR(),
  $store: env.SOURCE_DIR('store'),
  $utils: env.SOURCE_DIR('utils')
});
