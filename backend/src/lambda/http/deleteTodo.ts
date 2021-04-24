import 'source-map-support/register'

import {APIGatewayProxyResult} from 'aws-lambda'
import {formatJSONResponse, getUserId, ValidatedEventAPIGatewayHandler} from "../../utils/apiGateway";
import CreateTodoRequest from "../../requests/ReviewRequest";
import {deleteCompany} from "../../businessLogic/companies";
import {middyfy} from "../../utils/lambda";


const deleteTodoHandler: ValidatedEventAPIGatewayHandler<typeof CreateTodoRequest> = async (event): Promise<APIGatewayProxyResult> => {
  await deleteCompany(getUserId(event), event.pathParameters.todoId)
  return formatJSONResponse()
}

export const handler = middyfy(deleteTodoHandler)
