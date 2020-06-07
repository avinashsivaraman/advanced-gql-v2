const { ApolloServer } = require('apollo-server')
const typeDefs = require('./typedefs')
const resolvers = require('./resolvers')
const { createToken, getUserFromToken } = require('./auth')
const {
  FormatDateDirective,
  AuthenticationDirective,
  AuthorizationDirective,
} = require('./directives')
const db = require('./db')

const server = new ApolloServer({
  typeDefs,
  resolvers,
  schemaDirectives: {
    formatDate: FormatDateDirective,
    authenticated: AuthenticationDirective,
    authorizated: AuthorizationDirective,
  },
  context({ req, connection }) {
    const context = { ...db }
    if (connection) return { ...context, ...connection.context }
    const token = req.headers.authorization
    const user = getUserFromToken(token)
    return { ...context, user, createToken }
  },
  subscriptions: {
    onConnect(connectionParams) {
      console.log(connectionParams.Authorization)
      const user = getUserFromToken(connectionParams.Authorization)
      if (!user) {
        throw new Error('Not a valid user')
      }
      return { user }
    },
  },
})

server.listen(4000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
