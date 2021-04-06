'use strict';

const dynamodb = require('./dynamodb');

// module.exports.delete = (event, context, callback) => {
//   const params = {
//     TableName: process.env.DYNAMODB_TABLE,
//     Key: {
//       id: event.pathParameters.id,
//     },
//     ReturnValues: 'ALL_OLD',
//   };  
  
//   // delete the todo from the database
//   dynamodb.delete(params, (error) => {
//     // handle potential errors
//     if (error) {
//       console.error(error);
//       callback(null, {
//         statusCode: error.statusCode || 501,
//         headers: { 'Content-Type': 'text/plain' },
//         body: 'Couldn\'t remove the todo item.',
//       });
//       return;
//     }

//     // create a response
//     const response = {
//       statusCode: 200,
//       body: JSON.stringify({...params.Key}),
//     };
//     callback(null, response);
//   });
// };

module.exports.delete = async (event, context, callback) => {
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

