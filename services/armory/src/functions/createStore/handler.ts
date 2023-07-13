import { v4 as uuidv4 } from 'uuid';
import dynamodb from '../../common/dynamodb'
import { generateItem } from '../../common/generateItem'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { BatchWriteItemInput, WriteRequest } from '@aws-sdk/client-dynamodb';
import type { FromSchema } from "json-schema-to-ts";
import { bodySchema, schema } from './schema';
import { Handler, middyfy } from '../../common/middyfy';

const handler:Handler<FromSchema<typeof bodySchema>> = async (event) => {
  const { body: { amount = 1 } } = event;
  const requests = Array.from({length: amount}, () => ({
    PutRequest: {
      Item: marshall({
        id: uuidv4(),
        createdAt: new Date().getTime(),
        ...generateItem(),
      }),
    },
  }))

  const batchRequests = (array:WriteRequest[], size: number):BatchWriteItemInput[] => {
    let result = []
    for (let i = 0; i < array.length; i += size) {
      let chunk = array.slice(i, i + size)
      result.push({
        RequestItems: {
          [process.env.DYNAMODB_TABLE as string]: chunk
        },
      })
    }
    return result
  }

  const batches = batchRequests(requests, 25);

  await Promise.all(batches.map(async (batch) => await dynamodb.batchWriteItem(batch)))
  const result = requests.map(request => unmarshall(request.PutRequest.Item));
  
  return {
    statusCode: 200,
    body: JSON.stringify(result)
  }
};

export default middyfy(handler, schema);