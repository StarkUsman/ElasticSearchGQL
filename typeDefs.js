const { gql } = require('graphql-tag');

const typeDefs = gql`
scalar JSON

  type Query {
    getDocuments(index: String!, query: String, size: Int, fields: [String]): [Document]
    getDocumentById(index: String!, id: ID!, fields: [String]): Document
  }

  type Document {
    id: ID!
    fields: JSON
  }

  type Mutation {
    createIndex(index: String!): IndexResponse
    indexDocument(index: String!, id: ID!, document: JSON!, fields: [String]): DocumentResponse
    updateDocument(index: String!, id: ID!, document: JSON!, fields: [String]): DocumentResponse
    deleteDocument(index: String!, id: ID!): DeleteResponse
    deleteIndex(index: String!): DeleteResponse
  }

  type IndexResponse {
    acknowledged: Boolean!
    index: String!
  }

  type DocumentResponse {
    result: String!
    _id: ID!
    _index: String!
  }

  type DeleteResponse {
    acknowledged: Boolean!
    result: String
  }
`;

module.exports = typeDefs;
