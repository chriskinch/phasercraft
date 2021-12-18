import dynamodb from '../../common/dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const handler = async event => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: marshall({
      id: event.pathParameters.id,
    }),
    ReturnValues: 'ALL_OLD',
  };

  try {
    const data = await dynamodb.deleteItem(params);
    const item = unmarshall(data.Attributes);
    return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(item),
        }
  } catch (err) {
    console.log("ERROR: ", err);
    return {
      statusCode: err.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t delete the item.',
    };
  }
};

export default handler;