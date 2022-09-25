import dynamodb from '../../common/dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Handler, middyfy } from '../../common/middyfy';
import * as createError from 'http-errors';

const handler:Handler = async (event) => {
  const { pathParameters } = event;
  if(!pathParameters) throw new createError.BadRequest("Missing a valid path.");
  
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: marshall({
      id: pathParameters.id,
    }),
  };

  const data = await dynamodb.getItem(params);

  if(!data.Item) throw new createError.BadRequest("No item found with that ID.");

  const item = unmarshall(data.Item);
  return {
    statusCode: 200,
    body: JSON.stringify(item),
  }
};

export default middyfy(handler);