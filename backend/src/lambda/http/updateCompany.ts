import 'source-map-support/register'

import {APIGatewayProxyResult} from 'aws-lambda'

import UpdateCompanyRequest from '../../requests/UpdateCompanyRequest'
import {formatJSONResponse, ValidatedEventAPIGatewayHandler} from "../../utils/apiGateway";
import {middyfy} from "../../utils/lambda";
import {updateCompany} from "../../businessLogic/companies";

const updateCompanyHandler: ValidatedEventAPIGatewayHandler<typeof UpdateCompanyRequest> = async (event): Promise<APIGatewayProxyResult> => {
  await updateCompany(event.pathParameters.companyId, event.body)
  return formatJSONResponse()
}

export const handler = middyfy(updateCompanyHandler)
