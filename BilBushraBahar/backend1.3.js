// Invoke api exposed by API gateway → which connects with lambda → dumps the data to opensearch..
// This example assumes that the Lambda function is receiving a JSON request body with a title and 
// content property from API Gateway. It also sends the same data to an AWS Kinesis stream. You will need
//  to modify the code to fit your specific use case and replace the placeholder values with your own values.


const OpenSearch = require('opensearch');
const AWS = require('aws-sdk');
const uuid = require('uuid');

// Set up the OpenSearch client
const opensearchClient = new OpenSearch.Client({
  node: 'https://your-opensearch-cluster-endpoint'
});

// Set up the AWS SDK for accessing Kinesis
const kinesis = new AWS.Kinesis();

exports.handler = async (event, context) => {
  // Parse the request body
  const requestBody = JSON.parse(event.body);

  // Create a unique ID for the data
  const dataId = uuid.v4();

  // Format the data for OpenSearch
  const esData = {
    index: 'your-index-name',
    id: dataId,
    body: {
      title: requestBody.title,
      content: requestBody.content
    }
  };

  // Write the data to OpenSearch
  await opensearchClient.index(esData);

  // Format the data for Kinesis
  const kinesisData = {
    Data: JSON.stringify(requestBody),
    PartitionKey: dataId
  };

  // Send the data to Kinesis
  await kinesis.putRecord({
    StreamName: 'your-kinesis-stream-name',
    Data: kinesisData.Data,
    PartitionKey: kinesisData.PartitionKey
  }).promise();

  // Return a success response
  return {
    statusCode: 200,
    body: 'Data successfully dumped to OpenSearch and Kinesis'
  };
};