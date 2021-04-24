import * as elasticsearch from 'elasticsearch'
import {Client} from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'
import {CompanyItem} from "../models/CompanyItem";

const esHost = process.env.ES_ENDPOINT

const index = 'companies-index'
const type = 'companies'
const refresh = true

export class CompanySearch {
  constructor(private readonly es: Client = new elasticsearch.Client({
    hosts: [esHost],
    connectionClass: httpAwsEs
  })) {
  }

  async saveCompany(body: CompanyItem) {
    await this.es.index({
      index,
      type,
      refresh,
      id: body.companyId,
      body
    })
  }

  async searchCompanies(text: string, from: number, size: number, sort: string): Promise<CompanyItem[]> {
    const results = await this.es.search<CompanyItem>({
      index: 'companies-index',
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ["name", "country", "industry", "description"]
          }
        }
      },
      from, size, sort
    })
    return results.hits.hits.map(value => value._source)
  }

  async deleteCompany(companyId: string) {
    await this.es.delete({
      index,
      type,
      id: companyId
    })
  }
}
