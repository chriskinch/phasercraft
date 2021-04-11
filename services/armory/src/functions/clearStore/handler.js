import dynamodb from '../../common/dynamodb'

const handler = async () => {
	const params = {
		TableName: process.env.DYNAMODB_TABLE,
		AttributeDefinitions: [
      {
        AttributeName: "id",
        AttributeType: "S"
			},
		],
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

  try {
    await dynamodb.deleteTable(params);
		await dynamodb.createTable(params);
		console.log("Success, table cleared");
  } catch(err) {
		console.log("Error", err);
  }
};

export default handler;