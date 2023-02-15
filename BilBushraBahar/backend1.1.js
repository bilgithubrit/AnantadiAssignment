const OpenSearch = require('opensearch');

exports.handler = async (event, context) => {
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
          title: 'your-search-term'
        }
      }
    }
  });

  // Log the search results
  console.log(response.hits.hits);

  // Return a success response
  return {
    statusCode: 200,
    body: 'Search successful'
  };
};