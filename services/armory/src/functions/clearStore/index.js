import middy from '@middy/core' // esm Node v14+
import jsonBodyParser from '@middy/http-json-body-parser'
// import httpErrorHandler from '@middy/http-error-handler'
// import validator from '@middy/validator'

import handler from './handler';

export default middy(handler)
  .use(jsonBodyParser()) // parses the request body when it's a JSON and converts it to an object
//   .use(validator({inputSchema})) // validates the input
//   .use(httpErrorHandler()) // handles common http errors and returns proper responses