import dynamodb from '../../common/dynamodb'
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { Handler, middyfy } from '../../common/middyfy';

const handler:Handler = async () => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
  };
  
  const data = await dynamodb.scan(params);
  const items = data.Items.map(item => unmarshall(item))
  return {
    statusCode: 200,
    body: JSON.stringify(items),
  }
};

export default middyfy(handler);