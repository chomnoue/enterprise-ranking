export interface ICompany {
  companyId?: string
  name?: string
  country?: string
  industry?: string
  description?: string
  createdAt?: string
  createdBy?: string
  votesCount?: number
  totalScore?: number
  meanScore?: number
  images?: string[]
  imageUrls?: string[]
}

export class Company implements ICompany {
  constructor(public name?: string, public country?: string, public industry?: string, public description?: string) {}
}

export function getCompanyIdentifier(company: ICompany): string | undefined {
  return company.companyId;
}
