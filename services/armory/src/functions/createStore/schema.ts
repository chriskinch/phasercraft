export const bodySchema = {
  type: 'object',
  required: ['amount'],
  properties: {
    amount: { 
      type: 'number'
    },
  },
} as const;

export const schema = {
  type: "object",
  properties: {
    body: bodySchema
  }
} as const;