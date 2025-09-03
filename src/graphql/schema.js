import { buildSchema } from "graphql";

const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Animal {
    id: ID!
    name: String!
    species: String!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    animals: [Animal]
    animal(id: ID!): Animal
  }

  type Mutation {
    addUser(name: String!, email: String!): User
    addAnimal(name: String!, species: String!): Animal
  }
`);

export default schema;

