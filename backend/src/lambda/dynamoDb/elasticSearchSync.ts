import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import 'source-map-support/register'
import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'

const esHost = process.env.ES_ENDPOINT

const es = new elasticsearch.Client({
  hosts: [ esHost ],
  connectionClass: httpAwsEs
})

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  console.log('Processing events batch from DynamoDB', JSON.stringify(event))

  for (const record of event.Records) {
    console.log('Processing record', JSON.stringify(record))
    // if (record.eventName !== 'INSERT') {
    //   continue
    // }

    const newItem = record.dynamodb.NewImage

    const companyId = newItem.companyId.S

    const body = {
      companyId: newItem.companyId.S,
      country: newItem.country.S,
      industry: newItem.industry.S,
      description: newItem.description.S,
      createdAt: newItem.createdAt.S,
      createdBy: newItem.createdBy.S
    }

    await es.index({
      index: 'companies-index',
      type: 'companies',
      id: companyId,
      body
    })

  }
}
