import uuid from 'uuid'
import dynamodb from '../../common/dynamodb'
import { generateItem } from '../../common/generateItem'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const handler = async event => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: marshall({
      id: uuid(),
      createdAt: new Date().getTime(),
      ...generateItem(event.body),
    }),
    ReturnValues: 'ALL_OLD',
  };

  console.log("CHECK: ", params.Item.stats.L[0])
  
  try {
    await dynamodb.putItem(params);
    return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(unmarshall(params.Item)),
        }
  } catch (err) {
    console.log("ERROR: ", err);
    return {
      statusCode: err.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the item.',
    };
  }
};

export default handler;