module.exports = {
  chainWebpack: config => {
    config.plugins.delete('pwa');
    config.plugins.delete('workbox');
  },
  "runtimeCompiler": true,
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: process.env.NODE_ENV === 'production' ?
  './' :
  '/',
}