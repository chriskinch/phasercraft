'use strict';

const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");

let options = {};

// connect to local DB if running offline
if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
}

const client = new DynamoDB({
  region: 'localhost',
  endpoint: 'http://localhost:8000',
});

module.exports = client;
