module.exports = {
  pluginOptions: {
    apollo: {
      enableMocks: false,
      enableEngine: false,
      cors: process.env.VUE_APP_CORS || '*'
    }
  }
}
