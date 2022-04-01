const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave:false,
  devServer: {
    proxy: 'http://10.198.21.128:8888'
  },
  assetsDir: 'static',
  publicPath: './'
});
