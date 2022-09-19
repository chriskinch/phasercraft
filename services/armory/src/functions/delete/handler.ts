import dynamodb from '../../common/dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Handler, middyfy } from '../../common/middyfy';

const handler:Handler = async (event) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: marshall({
      id: event.pathParameters.id,
    }),
    ReturnValues: 'ALL_OLD',
  };

  const data = await dynamodb.deleteItem(params);
  const item = unmarshall(data.Attributes);
  return {
    statusCode: 200,
    body: JSON.stringify(item),
  }
};

export default middyfy(handler);