const { Client } = require('@elastic/elasticsearch');
const client = new Client({ 
    node: 'http://localhost:9200',
    auth: {
        username: 'elastic',
        password: 'sNji-2NkHLgYaJWTk16L'
    }
});

const resolvers = {
  Query: {
    getDocuments: async (_, { index, query = '*', size = 10000 }) => {
      try {
        const response = await client.search({
          index,
          size,
          body: {
            query: {
            //   match: { firstName: query }
              match_all: {}
            }
          }
        });

        // Map the Elasticsearch documents to the GraphQL Document type
        return response.hits.hits.map(hit => ({
          id: hit._id,
          data: hit._source
        }));
      } catch (error) {
        throw new Error('Error getting documents');
      }
    },
    getDocumentById: async (_, { index, id }) => {
      try {
        const response = await client.get({ index, id });
        
        // Return the document with id and source data
        return {
          id: response._id,
          data: response._source
        };
      } catch (error) {
        throw new Error('Error getting document by ID');
      }
    }
  },

  Mutation: {
    // Existing mutations
    createIndex: async (_, { index }) => {
      try {
        const response = await client.indices.create({ index });
        return { acknowledged: response.acknowledged, index: response.index };
      } catch (error) {
        throw new Error('Error creating index');
      }
    },
    indexDocument: async (_, { index, id, title, content }) => {
      try {
        const response = await client.index({
          index,
          id,
          document: { title, content }
        });
        return { result: response.result, _id: response._id, _index: response._index };
      } catch (error) {
        throw new Error('Error indexing document');
      }
    },
    updateDocument: async (_, { index, id, title, content, newField }) => {
      try {
        const response = await client.update({
          index,
          id,
          body: {
            doc: { title, content, newField }
          }
        });
        return { result: response.result, _id: response._id, _index: response._index };
      } catch (error) {
        throw new Error('Error updating document');
      }
    },
    deleteDocument: async (_, { index, id }) => {
      try {
        const response = await client.delete({ index, id });
        return { acknowledged: true, result: response.result };
      } catch (error) {
        throw new Error('Error deleting document');
      }
    },
    deleteIndex: async (_, { index }) => {
      try {
        const response = await client.indices.delete({ index });
        return { acknowledged: response.acknowledged };
      } catch (error) {
        throw new Error('Error deleting index');
      }
    }
  },

  JSON: {
    __serialize(value) {
      return value;
    },
    __parseValue(value) {
      return value;
    },
    __parseLiteral(ast) {
      return ast.value;
    }
  }
};

module.exports = resolvers;
