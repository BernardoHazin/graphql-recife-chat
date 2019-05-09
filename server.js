const express = require('express')
const path = require('path')
const server = require('vue-cli-plugin-apollo/graphql-server')

const opts = {
  host: 'localhost',
  port: 4000,
  graphqlPath: '/graphql',
  subscriptionsPath: '/graphql',
  enableMocks: false,
  enableEngine: false,
  cors: '*',
  timeout: 1000000,
  quiet: true,
  paths: {
    typeDefs: require.resolve('./apollo-server/type-defs.js'),
    resolvers: require.resolve('./apollo-server/resolvers.js'),
    context: require.resolve('./apollo-server/context.js'),
    directives: require.resolve('./apollo-server/directives.js'),
    dataSources: require.resolve('./apollo-server/data-sources.js')
  }
}

server(opts, () => {
  console.log('Apollo server is running!')
})

const app = express()
app.use(express.static(path.join(__dirname, 'dist')))

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('Express server is running!')
})
