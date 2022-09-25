import middy, { MiddyfiedHandler } from '@middy/core';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors'
import validator from '@middy/validator';
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context, Handler as AWSHandler } from 'aws-lambda';

export interface Event<TBody> extends Omit<APIGatewayProxyEvent, 'body'> {
  body: TBody;
}

export type Handler<TBody = void> = AWSHandler<
  Event<TBody>,
  APIGatewayProxyResult
>;

export const middyfy = (
  handler:Handler<never>,
  schema:Record<string, unknown> | null = null
): MiddyfiedHandler<Event<never>, APIGatewayProxyResult, Error, Context> => {
  
  const wrapper = middy(handler)
    .use(httpJsonBodyParser())
    .use(httpEventNormalizer())
    
  if(schema) {
    wrapper.use(validator({inputSchema: schema }))
  }

  wrapper
  .use(cors({
    origin: "*",
    credentials: true
  }))
  .use(httpErrorHandler())
  
  // @ts-ignore
  return wrapper;
}
