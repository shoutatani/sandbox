export const typeDefs = `#graphql
  scalar DateTime

  type User {
    id: ID!
    name: String
    avatar: String
    githubLogin: String
    postedPhotos: [Photo!]!
    inPhotos: [Photo!]!
  }

  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }

  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
    postedBy: User!
    taggedUsers: [User!]!
    created: DateTime!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    totalPhotos: Int!
    allPhotos(after: DateTime): [Photo!]!
    totalUsers: Int!
    allUsers: [User!]!
    me: User
  }

  input PostPhotoInput {
    name: String!
    description: String
    category: PhotoCategory=PORTRAIT
  }

  type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
    githubAuth(code: String!): AuthPayload!
    addFakeUsers(count: Int = 1): [User!]!
    fakeUserAuth(githubLogin: ID!): AuthPayload!
  }
`;
