const { ApolloServer, gql, PubSub } = require("apollo-server");
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

  type Subscription {
    newUser: User!
  }
`;

const NEW_USER = "NEW_USER";

const resolvers = {
  Subscription: {
    newUser: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator(NEW_USER),
    },
  },
  User: {
    firstLetterUsername: (parent) => {
      return parent.username[0];
    },
    // username: (parent) => {
    //   return parent.username;
    // },
  },
  Query: {
    hello: (parent, { name }) => {
      return `hey ${name}`;
    },
    user: () => ({
      id: 1,
      username: "test_username",
    }),
  },
  Mutation: {
    login: async (parent, { userInfo: { username } }, context) => {
      // check the password
      // await checkPassword(password);
      return username;
    },
    register: (_, { username }, { pubsub }) => {
      const user = {
        id: 1,
        username,
      };

      pubsub.publish(NEW_USER, {
        newUser: user,
      });

      return {
        errors: [
          {
            field: "username",
            message: "bad",
          },
        ],
        user,
      };
    },
  },
};

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: (req, res) => ({ req, res, pubsub }),
});

server.listen().then(({ url }) => console.log(`server starte at ${url}`));
