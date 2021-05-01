import * as uuid from 'uuid'
import {CompanyAccess} from "../dataLayer/companiesAccess"
import {FileAccess} from "../dataLayer/fileAccess"
import {CompanyItem} from "../models/CompanyItem";
import type {FromSchema} from "json-schema-to-ts"
import {CompanySearch} from "../dataLayer/companiesSearch";
import CreateCompanyRequest from "../requests/CreateCompanyRequest";
import UpdateCompanyRequest from "../requests/UpdateCompanyRequest";
import {Urls} from "../models/Urls";

const companyAccess = new CompanyAccess()
const companySearch = new CompanySearch()
const fileAccess = new FileAccess()

function setImageUrls(company: CompanyItem) {
  console.log("Augmenting company item:", company)
  company.meanScore = company.votesCount > 0 ? company.totalScore / company.votesCount : 0
  company.imageUrls = company.images? company.images.map(image => fileAccess.getGetSignedUrl(company.companyId + "/" + image)): []
}

export async function getCompany(companyId:string): Promise<CompanyItem> {
  const company = await companySearch.getCompany(companyId)
  setImageUrls(company)
  return company
}

export async function getCompanies(text: string, from: number = 0, size: number = 100, sort: string = "votesCount"): Promise<CompanyItem[]> {
  sort = sort.split(",")[0]
  const companies = await companySearch.searchCompanies(text, from, size, sort==="id"? "_id": sort)
  companies.forEach(company => setImageUrls(company))
  return companies
}

export async function createCompany(userId: string, request: FromSchema<typeof CreateCompanyRequest>): Promise<CompanyItem> {
  const companyId: string = uuid.v4()
  const companyItem: CompanyItem = {
    companyId,
    name: request.name,
    country: request.country,
    industry: request.industry,
    description: request.description,
    createdAt: new Date().toISOString(),
    createdBy: userId,
    votesCount: 0,
    totalScore: 0
  }
  await companyAccess.createCompany(companyItem)
  return companyItem
}

export async function updateCompany(companyId: string, request: FromSchema<typeof UpdateCompanyRequest>) {
  const newValues: { [key: string]: any } = {}
  if (request.name) {
    newValues.name = request.name
  }
  if (request.country) {
    newValues.country = request.country
  }
  if (request.industry) {
    newValues.industry = request.industry
  }
  if (request.description) {
    newValues.description = request.description
  }
  await companyAccess.updateCompany(companyId, newValues)
}

export async function deleteCompany(companyId: string) {
  await companyAccess.deleteCompany(companyId)
}

export async function generateUploadUrl(companyId: string): Promise<Urls> {
  return fileAccess.getPutSignedUrl(companyId)
}

