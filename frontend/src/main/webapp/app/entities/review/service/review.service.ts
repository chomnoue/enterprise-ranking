import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReview, getReviewIdentifier } from '../review.model';

export type EntityResponseType = HttpResponse<IReview>;
export type EntityArrayResponseType = HttpResponse<IReview[]>;



@Injectable({ providedIn: 'root' })
export class ReviewService {

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  resourceUrl(companyId: string): string {
    return this.applicationConfigService.getEndpointFor(`api/companies/${companyId}/reviews`);
  }

  reviewUrl(companyId: string): string {
    return this.applicationConfigService.getEndpointFor(`api/companies/${companyId}/review`);
  }
  create(companyId: string, review: IReview): Observable<EntityResponseType> {
    return this.http.post<IReview>(this.resourceUrl(companyId), review, { observe: 'response' });
  }

  update(companyId: string, review: IReview): Observable<EntityResponseType> {
    return this.http.put<IReview>(this.resourceUrl(companyId), review, { observe: 'response' });
  }

  partialUpdate(companyId: string, review: IReview): Observable<EntityResponseType> {
    return this.http.patch<IReview>(this.resourceUrl(companyId), review, { observe: 'response' });
  }

  find(companyId: string): Observable<EntityResponseType> {
    return this.http.get<IReview>(this.reviewUrl(companyId), { observe: 'response' });
  }

  query(companyId: string, req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IReview[]>(this.resourceUrl(companyId), { params: options, observe: 'response' });
  }

  delete(companyId: string): Observable<HttpResponse<{}>> {
    return this.http.delete(this.resourceUrl(companyId), { observe: 'response' });
  }

  addReviewToCollectionIfMissing(reviewCollection: IReview[], ...reviewsToCheck: (IReview | null | undefined)[]): IReview[] {
    const reviews: IReview[] = reviewsToCheck.filter(isPresent);
    if (reviews.length > 0) {
      const reviewCollectionIdentifiers = reviewCollection.map(reviewItem => getReviewIdentifier(reviewItem)!);
      const reviewsToAdd = reviews.filter(reviewItem => {
        const reviewIdentifier = getReviewIdentifier(reviewItem);
        if (reviewIdentifier == null || reviewCollectionIdentifiers.includes(reviewIdentifier)) {
          return false;
        }
        reviewCollectionIdentifiers.push(reviewIdentifier);
        return true;
      });
      return [...reviewsToAdd, ...reviewCollection];
    }
    return reviewCollection;
  }
}
