import 'source-map-support/register'

import {APIGatewayProxyResult} from 'aws-lambda'
import {formatJSONResponse, ValidatedEventAPIGatewayHandler} from "../../utils/apiGateway";
import {deleteCompany} from "../../businessLogic/companies";
import {middyfy} from "../../utils/lambda";


const deleteCompanyHandler: ValidatedEventAPIGatewayHandler<any> = async (event): Promise<APIGatewayProxyResult> => {
  await deleteCompany(event.pathParameters.companyId)
  return formatJSONResponse()
}

export const handler = middyfy(deleteCompanyHandler)
