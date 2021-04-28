import 'source-map-support/register'

import {APIGatewayProxyResult} from 'aws-lambda'
import {formatJSONResponse, ValidatedEventAPIGatewayHandler} from "../../utils/apiGateway";
import {generateUploadUrl} from "../../businessLogic/companies";
import {middyfy} from "../../utils/lambda";

const generateUploadUrlHandler: ValidatedEventAPIGatewayHandler<any> = async (event): Promise<APIGatewayProxyResult> => {
  const uploadUrls = await generateUploadUrl(event.pathParameters.todoId)
  return formatJSONResponse(uploadUrls)
}

export const handler = middyfy(generateUploadUrlHandler)
