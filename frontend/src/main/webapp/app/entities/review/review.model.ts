export interface IReview {
  id?: string;
  companyId?: string;
  comment?: string | null;
  score?: number;
}

export class Review implements IReview {
  constructor(public id?: string, public companyId?: string, public comment?: string | null, public score?: number) {}
}

export function getReviewIdentifier(review: IReview): string | undefined {
  return review.id;
}
