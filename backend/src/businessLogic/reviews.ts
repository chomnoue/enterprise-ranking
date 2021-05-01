import {CompanyAccess} from "../dataLayer/companiesAccess"
import ReviewRequest from "../requests/ReviewRequest"
import type {FromSchema} from "json-schema-to-ts"
import {NextReview} from "../models/Next";
import {ReviewAccess} from "../dataLayer/reviewsAccess";
import {ReviewItem} from "../models/ReviewItem";

const reviewAccess = new ReviewAccess()
const companyAccess = new CompanyAccess()

export async function getReview(companyId: string, userId: string): Promise<ReviewItem> {
  return await reviewAccess.getReview(companyId, userId)
}

export async function getReviews(companyId: string, next?: NextReview, limit?: number): Promise<ReviewItem[]> {
  return await reviewAccess.getReviews(companyId, next, limit)
}

export async function createReview(companyId: string, userId: string, request: FromSchema<typeof ReviewRequest>): Promise<ReviewItem> {
  const existing = await getReview(companyId, userId)
  if (existing) {
    return existing
  }
  const reviewItem: ReviewItem = {
    companyId,
    userId,
    review: request.review,
    score: request.score,
    createdAt: new Date().toISOString()
  }
  await reviewAccess.createReview(reviewItem)
  await companyAccess.updateVotes(companyId, 1, request.score)
  return reviewItem
}

export async function updateReview(companyId: string, userId: string, request: FromSchema<typeof ReviewRequest>): Promise<ReviewItem> {
  const existing = await getReview(companyId, userId)
  let delta = 0
  if (existing) {
    const newValues: { [key: string]: any } = {}
    if (request.review) {
      newValues.review = request.review
    }
    if (request.score) {
      newValues.score = request.score
      delta = request.score - existing.score
    }
    await reviewAccess.updateReview(companyId, userId, newValues)
    await companyAccess.updateVotes(companyId, 0, delta)
    return existing
  } else {
    return undefined
  }
}

export async function deleteReview(companyId: string, userId: string): Promise<ReviewItem> {
  const existing = await getReview(companyId, userId)
  if (existing) {
    await reviewAccess.deleteReview(companyId, userId)
    await companyAccess.updateVotes(companyId, -1, -existing.score)
    return existing
  } else {
    return undefined
  }
}

