import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IReview, Review } from '../review.model';
import { ReviewService } from '../service/review.service';
import {ReviewDeleteDialogComponent} from "app/entities/review/delete/review-delete-dialog.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'jhi-review-update',
  templateUrl: './review-update.component.html',
})
export class ReviewUpdateComponent implements OnInit {
  isSaving = false;
  companyId?: string;
  editForm = this.fb.group({
    userId: [],
    companyId: [],
    comment: [null, [Validators.required]],
    score: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
  });

  constructor(protected reviewService: ReviewService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder,
              protected modalService: NgbModal) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ review }) => {
      this.updateForm(review);
    });
    this.activatedRoute.params.subscribe(params => {
      this.companyId = params["companyId"];
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    if(this.companyId){
      this.isSaving = true;
      const review = this.createFromForm();
      if (review.userId) {
        this.subscribeToSaveResponse(this.reviewService.update(this.companyId, review));
      } else {
        this.subscribeToSaveResponse(this.reviewService.create(this.companyId,review));
      }
    }
  }

  delete(): void {
    const modalRef = this.modalService.open(ReviewDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    const review = this.createFromForm()
    modalRef.componentInstance.review = review;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.previousState();
      }
    });
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
      userId: review.userId,
      companyId: review.companyId,
      comment: review.review,
      score: review.score,
    });
  }

  protected createFromForm(): IReview {
    return {
      ...new Review(),
      userId: this.editForm.get(['userId'])!.value,
      companyId: this.editForm.get(['companyId'])!.value,
      review: this.editForm.get(['comment'])!.value,
      score: this.editForm.get(['score'])!.value,
    };
  }
}
