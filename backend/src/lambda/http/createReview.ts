import 'source-map-support/register'

import ReviewRequest from '../../requests/ReviewRequest'
import {formatJSONResponse, getUserId, ValidatedEventAPIGatewayHandler} from "../../utils/apiGateway";
import {createReview} from "../../businessLogic/reviews"
import {middyfy} from "../../utils/lambda";
import type {APIGatewayProxyResult} from "aws-lambda";

const createReviewHandler: ValidatedEventAPIGatewayHandler<typeof ReviewRequest> = async (event): Promise<APIGatewayProxyResult> => {
  const item = await createReview(event.pathParameters.companyId, getUserId(event), event.body)
  return formatJSONResponse({item})
}

export const handler = middyfy(createReviewHandler)
