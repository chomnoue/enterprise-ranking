export interface ICompany {
  id?: string;
  country?: string;
  industry?: string;
  description?: string;
}

export class Company implements ICompany {
  constructor(public id?: string, public country?: string, public industry?: string, public description?: string) {}
}

export function getCompanyIdentifier(company: ICompany): string | undefined {
  return company.id;
}
