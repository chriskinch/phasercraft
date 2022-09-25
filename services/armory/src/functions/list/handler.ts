import dynamodb from '../../common/dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { Handler, middyfy } from '../../common/middyfy';
import * as createError from 'http-errors';

const handler:Handler = async () => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
  };
  
  const data = await dynamodb.scan(params);

  if(!data.Items) throw new createError.BadRequest("No items found.");

  const items = data.Items.map(item => unmarshall(item))
  return {
    statusCode: 200,
    body: JSON.stringify(items!),
  }
};

export default middyfy(handler);