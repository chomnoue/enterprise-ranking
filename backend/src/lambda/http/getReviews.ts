import 'source-map-support/register'

import {APIGatewayProxyResult} from 'aws-lambda'
import {formatJSONResponse, ValidatedEventAPIGatewayHandler} from "../../utils/apiGateway";
import {middyfy} from "../../utils/lambda";
import {getReviews} from "../../businessLogic/reviews";
import {NextReview} from "../../models/Next";

const getReviewsHandler: ValidatedEventAPIGatewayHandler<any> = async (event): Promise<APIGatewayProxyResult> => {
  const nextUserId = event.queryStringParameters?.nextUserId
  const nextCreatedAt = event.queryStringParameters?.nextCreatedAt
  const next: NextReview = nextUserId && nextCreatedAt ? {userId: nextUserId, createdAt: nextCreatedAt} : undefined
  const limitStr = event.queryStringParameters?.limit
  const limit = limitStr ? Number(limitStr) : 100
  const reviews = await getReviews(event.pathParameters.companyId, next, limit)
  return formatJSONResponse(reviews)
}

export const handler = middyfy(getReviewsHandler)
