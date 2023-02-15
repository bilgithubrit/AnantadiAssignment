// This example assumes that the API Gateway is sending a JSON request body with a searchTerm property.
// You can modify this to fit your specific use case.

const OpenSearch = require('opensearch');

exports.handler = async (event, context) => {
  // Parse the request body
  const requestBody = JSON.parse(event.body);

  // Set up the OpenSearch client
  const client = new OpenSearch.Client({
    node: 'https://your-opensearch-cluster-endpoint'
  });

  // Execute a search request
  const response = await client.search({
    index: 'your-index-name',
    body: {
      query: {
        match: {
          title: requestBody.searchTerm
        }
      }
    }
  });

  // Return the search results as a JSON response
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(response.hits.hits)
  };
};