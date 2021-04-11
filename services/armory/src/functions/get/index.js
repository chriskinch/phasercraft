// import core
import middy from '@middy/core' // esm Node v14+
//const middy require('@middy/core') // commonjs Node v12+

// import some middlewares
import jsonBodyParser from '@middy/http-json-body-parser'
// import httpErrorHandler from '@middy/http-error-handler'
// import validator from '@middy/validator'

import handler from './handler';

// Notice that in the handler you only added base business logic (no deserialization,
// validation or error handler), we will add the rest with middlewares

const inputSchema = {
 type: 'object',
 properties: {
   body: {
     type: 'object',
     properties: {
       creditCardNumber: { type: 'string', minLength: 12, maxLength: 19, pattern: '\d+' },
       expiryMonth: { type: 'integer', minimum: 1, maximum: 12 },
       expiryYear: { type: 'integer', minimum: 2017, maximum: 2027 },
       cvc: { type: 'string', minLength: 3, maxLength: 4, pattern: '\d+' },
       nameOnCard: { type: 'string' },
       amount: { type: 'number' }
     },
     required: ['creditCardNumber'] // Insert here all required event properties
   }
 }
}

// Let's "middyfy" our handler, then we will be able to attach middlewares to it
export default middy(handler)
  .use(jsonBodyParser()) // parses the request body when it's a JSON and converts it to an object
//   .use(validator({inputSchema})) // validates the input
//   .use(httpErrorHandler()) // handles common http errors and returns proper responses