import uuid from 'uuid'
import dynamodb from '../../common/dynamodb'
import { generateItem } from '../../common/generateItem'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const handler = async event => {
	const amount = event?.body?.amount || 1;
	const requests = Array.from({length: amount}, () => ({
		PutRequest: {
			Item: marshall({
				id: uuid(),
				createdAt: new Date().getTime(),
				...generateItem(),
			}),
		},
	}))

	const batchRequests = (array, size) => {
		let result = []
		for (let i = 0; i < array.length; i += size) {
				let chunk = array.slice(i, i + size)
				result.push({
					RequestItems: {
						[process.env.DYNAMODB_TABLE]: chunk
					},
				})
		}
		return result
	}

	const batches = batchRequests(requests, 25);

  try {

	await Promise.all(batches.map(async (batch) => await dynamodb.batchWriteItem(batch)))
	const result = requests.map(request => unmarshall(request.PutRequest.Item));
    return {
		statusCode: 200,
		headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
		body: JSON.stringify(result)
	}
  } catch(err) {
    console.log("Error", err);
    return {
      statusCode: err.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create store.',
    };
  }
};

export default handler;