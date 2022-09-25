'use strict';

import  { DynamoDB } from '@aws-sdk/client-dynamodb';

let options = {};

// connect to local DB if running offline
if (process.env.IS_OFFLINE) {
  options = {
    region: 'localhost',
    endpoint: 'http://localhost:8000',
  };
}else{
  options = {
    region: 'us-east-1'
  }
}

const client = new DynamoDB(options);

export default client;
