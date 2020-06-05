const { ApolloServer, PubSub } = require('apollo-server')
const gql = require('graphql-tag')

const pubSub = new PubSub()
const NEW_ITEM = 'NEW_ITEM'

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    createdAt: Int!
  }

  type Settings {
    user: User!
    theme: String!
  }

  type Item {
    task: String!
  }

  input NewSettingInput {
    user: ID!
    theme: String!
  }
  type Query {
    me: User!
    settings(user: ID!): Settings!
  }

  type Mutation {
    settings(input: NewSettingInput): Settings!
    createItem(task: String!): Item
  }

  type Subscription {
    newItem: Item
  }
`

const resolvers = {
  Query: {
    me() {
      return {
        id: 1,
        username: 'Avinash',
        createdAt: Date.now(),
      }
    },
    settings(_, { user }) {
      return {
        user: user,
        theme: 'dark',
      }
    },
  },
  Mutation: {
    settings(_, { input }) {
      return input
    },
    createItem(_, { task }) {
      const newItem = { task }
      pubSub.publish(NEW_ITEM, { newItem })
      return newItem
    },
  },
  Subscription: {
    newItem: {
      subscribe: () => pubSub.asyncIterator(NEW_ITEM),
    },
  },
  Settings: {
    user() {
      return {
        id: 1,
        username: 'Avinash',
        createdAt: Date.now(),
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context({ connection }) {
    if (connection) {
      return { ...connection.context }
    }
  },
  subscriptions: {
    onConnect(params) {
      console.log(params)
    },
  },
})

server.listen().then(({ url }) => console.log(`The server at ${url}`))
