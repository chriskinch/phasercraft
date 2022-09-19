import dynamodb from '../../common/dynamodb';
import { Handler, middyfy } from '../../common/middyfy';

const handler:Handler = async () => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    AttributeDefinitions: [{
      AttributeName: "id",
      AttributeType: "S"
    }],
    KeySchema: [
      {
        AttributeName: "id",
        KeyType: "HASH"
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  }

  await dynamodb.deleteTable(params);
  await dynamodb.createTable(params);
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: "Success, store cleared!"
  }
};

export default middyfy(handler);