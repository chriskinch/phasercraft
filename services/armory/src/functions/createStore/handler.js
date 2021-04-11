import uuid from 'uuid'
import dynamodb from '../../common/dynamodb'
import { generateItem } from '../../common/generateItem'
import { marshall } from '@aws-sdk/util-dynamodb';

const handler = async event => {
	const requests = Array.from({length: 45}, () => ({
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
    // const data = await dynamodb.send(new BatchWriteItemCommand(params));

		await Promise.all(batches.map(async (batch) => {
			await dynamodb.batchWriteItem(batch);
		}));

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(requests),
    }
  } catch(err) {
    console.error(err);
    return {
      statusCode: err.statusCode || 501,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the item.',
    };
  }
};

export default handler;