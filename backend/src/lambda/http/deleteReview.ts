import 'source-map-support/register'

import {APIGatewayProxyResult} from 'aws-lambda'
import {formatJSONResponse, getUserId, ValidatedEventAPIGatewayHandler} from "../../utils/apiGateway";
import {deleteReview} from "../../businessLogic/reviews";
import {middyfy} from "../../utils/lambda";


const deleteReviewHandler: ValidatedEventAPIGatewayHandler<any> = async (event): Promise<APIGatewayProxyResult> => {
  await deleteReview(event.pathParameters.companyId, getUserId(event))
  return formatJSONResponse()
}

export const handler = middyfy(deleteReviewHandler)
