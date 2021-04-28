import 'source-map-support/register'

import {APIGatewayProxyResult} from 'aws-lambda'
import {formatJSONResponse, getUserId, ValidatedEventAPIGatewayHandler} from "../../utils/apiGateway";
import {middyfy} from "../../utils/lambda";
import {getReview} from "../../businessLogic/reviews";

const getReviewHandler: ValidatedEventAPIGatewayHandler<any> = async (event): Promise<APIGatewayProxyResult> => {
  const review = await getReview(event.pathParameters.companyId, getUserId(event))
  return formatJSONResponse(review)
}

export const handler = middyfy(getReviewHandler)
