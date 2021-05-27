import dynamodb from '../../common/dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb';

const handler = async () => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
  };
  
  try {
    const data = await dynamodb.scan(params);
    const items = data.Items.map(item => unmarshall(item))
    return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(items),
        }
  } catch (err) {
    console.log("ERROR: ", err);
    return {
      statusCode: err.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t list the items.',
    };
  }
};

export default handler;