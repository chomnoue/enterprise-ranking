import 'source-map-support/register'

import {APIGatewayProxyResult} from 'aws-lambda'

import UpdateReviewRequest from '../../requests/ReviewRequest'
import {formatJSONResponse, getUserId, ValidatedEventAPIGatewayHandler} from "../../utils/apiGateway";
import {middyfy} from "../../utils/lambda";
import {updateReview} from "../../businessLogic/reviews";

const updateTodosHandler: ValidatedEventAPIGatewayHandler<typeof UpdateReviewRequest> = async (event): Promise<APIGatewayProxyResult> => {
  await updateReview(event.pathParameters.companyId, getUserId(event), event.body)
  return formatJSONResponse()
}

export const handler = middyfy(updateTodosHandler)
