import {DocumentClient} from 'aws-sdk/clients/dynamodb'
import {XAWS} from "./aws";
import {CompanyItem} from "../models/CompanyItem";


export class CompanyAccess {

  constructor(
      private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly companiesTable = process.env.COMPANIES_TABLE
  ) {
  }

  async createCompany(companyItem: CompanyItem) {
    await this.docClient.put({
      TableName: this.companiesTable,
      Item: companyItem
    }).promise()
  }

  async updateCompany(companyId: string, newValues: { [key: string]: any }) {
    const attributesUpdates = {}
    for (let key in newValues) {
      attributesUpdates[key] = {Action: "PUT", Value: newValues[key]}
    }
    await this.docClient.update({
      TableName: this.companiesTable,
      Key: {companyId},
      AttributeUpdates: attributesUpdates,
      ReturnValues: "UPDATED_NEW"
    }).promise();
  }

  async updateVotes(companyId: string, count: number, score: number) {
    await this.docClient.update({
      TableName: this.companiesTable,
      Key: {companyId},
      UpdateExpression: "set votesCount = votesCount + :count, totalScore = totalScore + :score",
      ExpressionAttributeValues: {
        ":count": count,
        ":score": score
      },
      ReturnValues: "UPDATED_NEW"
    }).promise();
  }

  async addImage(companyId: string, key: string) {
    await this.docClient.update({
      TableName: this.companiesTable,
      Key: {companyId},
      UpdateExpression: "add #images :keys",
      ExpressionAttributeNames: {
        '#images': 'images'
      },
      ExpressionAttributeValues: {
        ":keys": this.docClient.createSet([key])
      },
      ReturnValues: "UPDATED_NEW"
    }).promise();
  }

  async deleteCompany(companyId: string) {
    await this.docClient.delete({
      TableName: this.companiesTable,
      Key: {companyId}
    }).promise();
  }

  async getCompany(companyId: string): Promise<CompanyItem> {
    const result = await this.docClient.get({
      TableName: this.companiesTable,
      Key: {companyId}
    }).promise()
    return result.Item as CompanyItem;
  }

}
