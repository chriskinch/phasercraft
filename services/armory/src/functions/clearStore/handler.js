import dynamodb from '../../common/dynamodb'

const handler = async () => {
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

	try {
		await dynamodb.deleteTable(params);
		await dynamodb.createTable(params);
		return {
			statusCode: 200,
			headers: { 'Content-Type': 'text/plain' },
			body: "Success, store cleared!"
		}
	} catch(err) {
		console.log("Error", err);
		return {
			statusCode: err.statusCode || 501,
			headers: { 'Content-Type': 'text/plain' },
			body: 'Couldn\'t clear store.',
		}
	}
};

export default handler;