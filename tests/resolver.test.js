const resolvers = require('./../src/resolvers')

describe('Resolver Unit Testing', () => {
  test('Feed', () => {
    const models = {
      Post: {
        findMany: jest.fn(() => ['hello', 'world']),
      },
    }
    expect(resolvers.Query.feed(null, null, { models })).toEqual([
      'hello',
      'world',
    ])
  })
})
