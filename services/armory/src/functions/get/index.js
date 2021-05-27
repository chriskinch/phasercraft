import middy from '@middy/core'
import jsonBodyParser from '@middy/http-json-body-parser'
// import httpErrorHandler from '@middy/http-error-handler'

import handler from './handler';

export default middy(handler)
  .use(jsonBodyParser())
//   .use(httpErrorHandler())