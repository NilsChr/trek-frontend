module.exports = {
  "runtimeCompiler": true,
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: process.env.NODE_ENV === 'production' ?
  './' :
  '/',
}