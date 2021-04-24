export interface CompanyItem {
  companyId: string
  name: string
  country: string
  industry: string
  description: string
  createdAt: string
  createdBy: string
  votesCount: number
  totalScore: number
  meanScore?: number
  images: string[]
  imageUrls?: string[]
}
