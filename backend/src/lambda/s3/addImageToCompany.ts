import {S3Event, SNSEvent, SNSHandler} from 'aws-lambda'
import 'source-map-support/register'
import {CompanyAccess} from "../../dataLayer/companiesAccess";


const companyAccess = new CompanyAccess()

export const handler: SNSHandler = async (event: SNSEvent) => {
  console.log('Processing SNS event ', JSON.stringify(event))
  for (const snsRecord of event.Records) {
    const s3EventStr = snsRecord.Sns.Message
    console.log('Processing S3 event', s3EventStr)
    const s3Event = JSON.parse(s3EventStr)

    await processS3Event(s3Event)
  }
}

async function processS3Event(s3Event: S3Event) {
  for (const record of s3Event.Records) {
    const key =record.s3.object.key
    console.log('Processing S3 item with key: ', key)
    const keys = key.split("/")
    await companyAccess.addImage(keys[0], keys[1])
  }
}
