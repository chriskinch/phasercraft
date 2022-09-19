import middy, { MiddyfiedHandler } from '@middy/core';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors'
import validator from '@middy/validator';
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler as AWSHandler } from 'aws-lambda';

export interface Event<TBody> extends Omit<APIGatewayProxyEvent, 'body'> {
  body: TBody;
}

export type Handler<TBody = void> = AWSHandler<
  Event<TBody>,
  APIGatewayProxyResult
>;

export const middyfy = (handler:Handler<never>, schema?:Record<string, unknown>): MiddyfiedHandler<Event<never>> => {
  const wrapper = middy(handler)
    .use(httpHeaderNormalizer())
    .use(httpJsonBodyParser())
    .use(httpErrorHandler())
    .use(cors({
      origin: "*",
      credentials: true
    }))

  if(schema) {
    wrapper.use(validator({inputSchema: schema }))
  }

  return wrapper;
}
