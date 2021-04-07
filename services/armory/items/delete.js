'use strict';

const dynamodb = require('./dynamodb');

module.exports.delete = async event => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ReturnValues: 'ALL_OLD',
  };  
  
  try {
    const data = await dynamodb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({...data.Attributes}),
    };
  } catch(err) {
    console.error(err);
    return {
      statusCode: err.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t remove the todo item.',
    };
      
  }
};

