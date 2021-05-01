export interface IReview {
  userId?: string;
  companyId?: string;
  review?: string | null;
  score?: number;
}

export class Review implements IReview {
  constructor(public userId?: string, public companyId?: string, public review?: string | null, public score?: number) {}
}

export function getReviewIdentifier(review: IReview): string | undefined {
  return review.userId;
}
