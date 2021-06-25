const { ApolloServer, gql } = require("apollo-server");
// type checking
// query vs mutation
// objects
// array
// arguments

const typeDefs = gql`
  type Query {
    hello: String
    user: User
  }

  type User {
    id: ID!
    username: String!
    firstLetterUsername: String!
  }

  type Error {
    field: String!
    message: String!
  }

  type RegisterResponse {
    errors: [Error]
    user: User
  }

  input UserInfo {
    username: String!
    password: String!
    age: Int
  }

  type Mutation {
    register(userInfo: UserInfo!): RegisterResponse!
    login(userInfo: UserInfo!): String!
  }
`;

const resolvers = {
  User: {
    firstLetterUsername: (parent) => {
      return parent.username[0];
    },
    // username: (parent) => {
    //   return parent.username;
    // },
  },
  Query: {
    hello: () => null,
    user: () => ({
      id: 1,
      username: "smithhashhh",
    }),
  },
  Mutation: {
    login: async (parent, { userInfo: { username } }, context) => {
      // check the password
      // await checkPassword(password);
      return username;
    },
    register: () => ({
      errors: [
        {
          field: "username",
          message: "bad",
        },
      ],
      user: {
        id: 1,
        username: "tomas",
      },
    }),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (req, res) => ({ req, res }),
});

server.listen().then(({ url }) => console.log(`server starte at ${url}`));
