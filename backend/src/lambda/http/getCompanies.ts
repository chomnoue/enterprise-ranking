import 'source-map-support/register'

import {APIGatewayProxyResult} from 'aws-lambda'
import {formatJSONResponse, ValidatedEventAPIGatewayHandler} from "../../utils/apiGateway";
import {middyfy} from "../../utils/lambda";
import {getCompanies} from "../../businessLogic/companies";

const getCompaniesHandler: ValidatedEventAPIGatewayHandler<any> = async (event): Promise<APIGatewayProxyResult> => {
  const text = event.queryStringParameters?.text
  const sort = event.queryStringParameters?.sort || 'votesCount'
  const sizeStr = event.queryStringParameters?.size
  const size = sizeStr ? Number(sizeStr) : 100
  const fromStr = event.queryStringParameters?.from
  const from = fromStr ? Number(fromStr) : 0
  const companies = await getCompanies(text, from, size, sort)
  return formatJSONResponse(companies)
}

export const handler = middyfy(getCompaniesHandler)
