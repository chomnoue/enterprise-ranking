import * as elasticsearch from 'elasticsearch'
import {Client} from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'
import {CompanyItem} from "../models/CompanyItem";
import {createLogger} from "../utils/logger";

const esHost = process.env.ES_ENDPOINT

const index = 'companies-index'
const type = 'companies'
const refresh = true
const logger = createLogger('auth')

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
    logger.info("Searching text: ", text)
    const results = await this.es.search<CompanyItem>({
      index,
      body: {
        query: {
          simple_query_string: {
            query: text || '*',
            fields: ["name", "country", "industry", "description"]
          }
        }
      },
      from, size, sort
    })
    logger.info("Search results: ", results)
    return results.hits.hits.map(value => value._source)
  }

  async getCompany(companyId: string) : Promise<CompanyItem> {
    const  result = await this.es.get<CompanyItem>({
      index,
      type,
      id: companyId
    })
    return result._source
  }

  async deleteCompany(companyId: string) {
    await this.es.delete({
      index,
      type,
      id: companyId
    })
  }

  async createIndex() {
    const exists = await this.es.indices.exists({index})
    if (!exists) {
      await this.es.indices.create({
        index
      })
    }
    await this.es.indices.putMapping({
      index,
      type,
      body: {
        "properties": {
          "companyId": {"type": "keyword"},
          "name": {"type": "text"},
          "country": {"type": "text"},
          "industry": {"type": "text"},
          "description": {"type": "text"},
          "createdAt": {"type": "date"},
          "createdBy": {"type": "keyword"},
          "votesCount": {"type": "long"},
          "totalScore": {"type": "long"},
          "meanScore": {"type": "double"}
        }
      }
    })
  }
}
