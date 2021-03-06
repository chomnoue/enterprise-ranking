export default {
  type: "object",
  properties: {
    review: {type: 'string'},
    score: {type: 'number', minimum: 1, maximum: 5}
  },
  required: ['review', 'score']
} as const;
