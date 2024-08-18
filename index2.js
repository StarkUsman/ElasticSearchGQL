const { Client } = require('@elastic/elasticsearch');

// Create a new client instance
const client = new Client({ 
    node: 'http://localhost:9200',
    auth: {
        username: 'elastic',
        password: 'sNji-2NkHLgYaJWTk16L'
    }
});

// Test the connection
client.ping({}, { requestTimeout: 30000 }, (error) => {
  if (error) {
    console.error('Elasticsearch cluster is down!', error);
  } else {
    console.log('Elasticsearch is connected');
  }
});

client.ping();

// Example function to create an index/table
async function createIndex() {
  try {
    const response = await client.indices.create({ index: 'cim_customer' });
    console.log(response);
  } catch (error) {
    console.error('Error creating index:', error);
  }
}

// Example function to index/create a document
async function indexDocument() {
  try {
    const response = await client.index({
      index: 'cim_customer',
      id: '1',
      document: {
        title: 'Test Document 1',
        content: 'This is a test document'
      }
    });
    console.log(response);
  } catch (error) {
    console.error('Error indexing document:', error);
  }
}

// Example function to get all the documents
async function getDocuments() {
  try {
    const response = await client.search({
      index: 'my_index', // index means the name of the table
      size: 100,
      body: {
        query: {
          match_all: {},
          // match: { firstName: 'John*' }
        }
      }
    });
    console.log(response.hits.hits);
  } catch (error) {
    console.error('Error getting documents:', error);
  }
}

//Example function to get documents by id
async function getDocumentById() {
    try {
      const response = await client.get({
        index: 'my_index',
        id: '1'
      });
      console.log(response);
    } catch (error) {
      console.error('Error getting document by id:', error);
    }
  }

  // Example function to update a document
async function updateDocument() {
    try {
      const response = await client.update({
        index: 'cim_customer',
        id: '1',
        body: {
          doc: {
            title: 'Faraz Testing Updated Document 1',
            content: 'This is an updated document',
            newfield: 'new field value'
          }
        }
      });
      console.log(response);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  }

  // Example function to delete a document
async function deleteDocument() {
    try {
      const response = await client.delete({
        index: 'cim_customer',
        id: '1'
      });
      console.log(response);
    } catch (error) {
      console.error('Error deleting document:', error.meta.body.result);
    }
  }

  // Example function to delete an index
async function deleteIndex() {
    try {
      const response = await client.indices.delete({ index: 'cim_customer' });
      console.log(response);
    } catch (error) {
      console.error('Error deleting index:', error.meta.statusCode, "not found");
    }
  }


// Call the functions
// createIndex();
// indexDocument();
getDocuments();
// getDocumentById();
// updateDocument();
// deleteDocument();
// deleteIndex();