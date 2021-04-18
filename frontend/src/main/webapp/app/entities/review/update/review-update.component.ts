import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IReview, Review } from '../review.model';
import { ReviewService } from '../service/review.service';

@Component({
  selector: 'jhi-review-update',
  templateUrl: './review-update.component.html',
})
export class ReviewUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    companyId: [null, [Validators.required]],
    comment: [],
    score: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
  });

  constructor(protected reviewService: ReviewService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ review }) => {
      this.updateForm(review);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const review = this.createFromForm();
    if (review.id !== undefined) {
      this.subscribeToSaveResponse(this.reviewService.update(review));
    } else {
      this.subscribeToSaveResponse(this.reviewService.create(review));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReview>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(review: IReview): void {
    this.editForm.patchValue({
      id: review.id,
      companyId: review.companyId,
      comment: review.comment,
      score: review.score,
    });
  }

  protected createFromForm(): IReview {
    return {
      ...new Review(),
      id: this.editForm.get(['id'])!.value,
      companyId: this.editForm.get(['companyId'])!.value,
      comment: this.editForm.get(['comment'])!.value,
      score: this.editForm.get(['score'])!.value,
    };
  }
}
