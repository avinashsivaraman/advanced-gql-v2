const gql = require('graphql-tag')
const createTestServer = require('./helper')
const CREATE_POST = gql`
  mutation {
    createPost(input: { message: "hello" }) {
      message
    }
  }
`

const UPDATE_SETTING = gql`
  mutation {
    updateSettings(input: { theme: DARK }) {
      id
      theme
    }
  }
`

describe('Mutation', () => {
  test('CreatePost', async () => {
    const { mutate } = createTestServer({
      user: { id: 1 },
      models: {
        Post: {
          createOne: jest.fn(() => [
            {
              id: 1,
              message: 'hello',
              createdAt: 12345839,
              likes: 20,
              views: 300,
            },
          ]),
        },
      },
    })

    const res = await mutate({ query: CREATE_POST })
    expect(res).toMatchSnapshot()
  })
  test('UpdateSettings', async () => {
    const { mutate } = createTestServer({
      user: { id: 1 },
      models: {
        Settings: {
          updateOne(_, input) {
            return {
              id: 1,
              ...input,
            }
          },
        },
      },
    })
    const res = await mutate({ query: UPDATE_SETTING })
    expect(res.data.updateSettings).toEqual({ id: '1', theme: 'DARK' })
  })
})
