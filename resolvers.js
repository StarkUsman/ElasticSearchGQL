const { Client } = require('@elastic/elasticsearch');
const client = new Client({ 
    node: 'http://localhost:9200',
    auth: {
        username: 'elastic',
        password: 'sNji-2NkHLgYaJWTk16L'
    }
});

const filterFields = (source, fields) => {
  if (!fields || fields.length === 0) {
    return source; // Return all fields if no specific fields are requested
  }
  return fields.reduce((acc, field) => {
    acc[field] = source[field] || ''; // Default to empty string if field does not exist
    return acc;
  }, {});
};

const resolvers = {
  Query: {
    getDocuments: async (_, { index, query = '*', size = 100, fields = [] }) => {
      try {
        const response = await client.search({
          index,
          size,
          body: {
            query: {
              match_all: {}
            }
          }
        });

        return response.hits.hits.map(hit => ({
          id: hit._id,
          fields: filterFields(hit._source, fields) // Filter fields based on request
        }));
      } catch (error) {
        throw new Error('Error getting documents');
      }
    },

    getDocumentById: async (_, { index, id, fields = [] }) => {
      try {
        const response = await client.get({ index, id });
        return {
          id: response._id,
          fields: filterFields(response._source, fields) // Filter fields based on request
        };
      } catch (error) {
        throw new Error('Error getting document by ID');
      }
    }
  },

  Mutation: {
    createIndex: async (_, { index }) => {
      try {
        const response = await client.indices.create({ index });
        return { acknowledged: response.acknowledged, index: response.index };
      } catch (error) {
        throw new Error('Error creating index');
      }
    },

    indexDocument: async (_, { index, id, document, fields = [] }) => {
      try {
        const filteredDocument = filterFields(document, fields);

        const response = await client.index({ // Index the document but if the document already exists, update it by default
          index,
          id,
          document: filteredDocument // Only index the filtered document
        });
        return { result: response.result, _id: response._id, _index: response._index };
      } catch (error) {
        throw new Error('Error indexing document');
      }
    },

    updateDocument: async (_, { index, id, document, fields = [] }) => {
      try {
        const filteredDocument = filterFields(document, fields);

        const response = await client.update({ // Update the document but if the document does not exist, throw an error
          index,
          id,
          body: {
            doc: filteredDocument // Only update with the filtered document fields and delete the rest of the fields
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
  }
};

module.exports = resolvers;
