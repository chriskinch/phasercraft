import { v4 as uuidv4 } from 'uuid';
import dynamodb from '../../common/dynamodb'
import { generateItem } from '../../common/generateItem'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import type { FromSchema } from "json-schema-to-ts";
import { bodySchema, schema } from './schema';
import { Handler, middyfy } from '../../common/middyfy';

const handler:Handler<FromSchema<typeof bodySchema>> = async (event) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: marshall({
      id: uuidv4(),
      createdAt: new Date().getTime(),
      ...generateItem(event.body),
    }),
    ReturnValues: 'ALL_OLD',
  };
  
  await dynamodb.putItem(params);
  return {
    statusCode: 200,
    body: JSON.stringify(unmarshall(params.Item)),
  }
};

export default middyfy(handler, schema);