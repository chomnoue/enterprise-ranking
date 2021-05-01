import {CompanySearch} from "../dataLayer/companiesSearch";

const companySearch = new CompanySearch()

export async function initResources(){
  await companySearch.createIndex()
}
