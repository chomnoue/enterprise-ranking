import {DocumentClient} from 'aws-sdk/clients/dynamodb'
import {XAWS} from "./aws";
import {NextReview} from "../models/Next";
import {ReviewItem} from "../models/ReviewItem";


export class ReviewAccess {

  constructor(
      private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly reviewsTable = process.env.REVIEWS_TABLE,
      private readonly creationDateIndex = process.env.REVIEWS_CREATION_DATE_INDEX
  ) {
  }

  async getReview(companyId: string, userId: string): Promise<ReviewItem> {
    const result = await this.docClient.get({
      TableName: this.reviewsTable,
      Key: {companyId, userId}
    }).promise();
    return result.Item as ReviewItem
  }

  async getReviews(companyId: string, next?: NextReview, limit?: number): Promise<ReviewItem[]> {
    const nextKey = next ? {companyId, ...next} : undefined
    const result = await this.docClient.query({
      TableName: this.reviewsTable,
      IndexName: this.creationDateIndex,
      KeyConditionExpression: 'companyId = :companyId',
      ExpressionAttributeValues: {
        ':companyId': companyId
      },
      ExclusiveStartKey: nextKey,
      Limit: limit
    }).promise()
    return result.Items as ReviewItem[] || []
  }

  async createReview(reviewItem: ReviewItem) {
    await this.docClient.put({
      TableName: this.reviewsTable,
      Item: reviewItem
    }).promise()
  }

  async updateReview(companyId: string, userId: string, newValues: { [key: string]: any }) {
    const attributesUpdates = {}
    for (let key in newValues) {
      attributesUpdates[key] = {Action: "PUT", Value: newValues[key]}
    }
    await this.docClient.update({
      TableName: this.reviewsTable,
      Key: {companyId, userId},
      AttributeUpdates: attributesUpdates,
      ReturnValues: "UPDATED_NEW"
    }).promise();
  }

  async deleteReview(companyId: string, userId: string) {
    await this.docClient.delete({
      TableName: this.reviewsTable,
      Key: {companyId, userId}
    }).promise();
  }
}
