import 'source-map-support/register'

import CreateTodoRequest from '../../requests/ReviewRequest'
import {formatJSONResponse, getUserId, ValidatedEventAPIGatewayHandler} from "../../utils/apiGateway";
import {createCompany} from "../../businessLogic/companies"
import {middyfy} from "../../utils/lambda";
import type {APIGatewayProxyResult} from "aws-lambda";

const createTodoHandler: ValidatedEventAPIGatewayHandler<typeof CreateTodoRequest> = async (event): Promise<APIGatewayProxyResult> => {
  const item = await createCompany(getUserId(event), event.body)
  return formatJSONResponse({item})
}

export const handler = middyfy(createTodoHandler)
