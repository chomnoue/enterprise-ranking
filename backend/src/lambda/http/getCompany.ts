import 'source-map-support/register'

import {APIGatewayProxyResult} from 'aws-lambda'
import {formatJSONResponse, ValidatedEventAPIGatewayHandler} from "../../utils/apiGateway";
import {middyfy} from "../../utils/lambda";
import {getCompany} from "../../businessLogic/companies";

const getCompaniesHandler: ValidatedEventAPIGatewayHandler<any> = async (event): Promise<APIGatewayProxyResult> => {
  const company = await getCompany(event.pathParameters.companyId)
  if (company){
    return formatJSONResponse(company)
  }else {
    return formatJSONResponse({"message": "Company not found"}, 404)
  }
}

export const handler = middyfy(getCompaniesHandler)
