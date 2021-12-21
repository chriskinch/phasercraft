import dynamodb from '../../common/dynamodb'

const handler = async () => {
	const params = {
		TableName: process.env.DYNAMODB_TABLE
	}

	try {
		await dynamodb.deleteTable(params);
		return {
			statusCode: 200,
			headers: { 'Content-Type': 'text/plain' },
			body: "Success, table deleted!"
		}
	} catch(err) {
		console.log("Error", err);
		return {
			statusCode: err.statusCode || 501,
			headers: { 'Content-Type': 'text/plain' },
			body: 'Couldn\'t delete table.',
		}
	}
};

export default handler;