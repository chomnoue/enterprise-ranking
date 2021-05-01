import {DynamoDBStreamEvent, DynamoDBStreamHandler} from 'aws-lambda'
import 'source-map-support/register'
import {CompanySearch} from "../../dataLayer/companiesSearch";
import {CompanyItem} from "../../models/CompanyItem";

const companySearch = new CompanySearch()
export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
  console.log('Processing events batch from DynamoDB', JSON.stringify(event))

  for (const record of event.Records) {
    console.log('Processing record', JSON.stringify(record))
    if (record.eventName !== 'REMOVE') {

    const newItem = record.dynamodb.NewImage

    const companyId = newItem.companyId.S
    const votesCount = parseInt(newItem.votesCount.N)
    const totalScore = parseInt(newItem.totalScore.N)
    const meanScore = votesCount > 0 ? totalScore / votesCount : 0

    const body: CompanyItem = {
      companyId,
      name: newItem.name.S,
      country: newItem.country.S,
      industry: newItem.industry.S,
      description: newItem.description.S,
      createdAt: newItem.createdAt.S,
      createdBy: newItem.createdBy.S,
      images: newItem.images?.SS ?? [],
      votesCount,
      totalScore,
      meanScore
    }

    await companySearch.saveCompany(body)

    } else {
      const companyId = record.dynamodb.Keys.companyId.S
      await companySearch.deleteCompany(companyId)
    }

  }
}
