export default {
  type: "object",
  properties: {
    name: { type: 'string' },
    country: { type: 'string' },
    industry: { type: 'string' },
    description: { type: 'string' }
  }
} as const;
