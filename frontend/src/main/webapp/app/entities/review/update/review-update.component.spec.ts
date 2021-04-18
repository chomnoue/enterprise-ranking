jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ReviewService } from '../service/review.service';
import { IReview, Review } from '../review.model';

import { ReviewUpdateComponent } from './review-update.component';

describe('Component Tests', () => {
  describe('Review Management Update Component', () => {
    let comp: ReviewUpdateComponent;
    let fixture: ComponentFixture<ReviewUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let reviewService: ReviewService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ReviewUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ReviewUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ReviewUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      reviewService = TestBed.inject(ReviewService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const review: IReview = { id: 'CBA' };

        activatedRoute.data = of({ review });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(review));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const review = { id: 'ABC' };
        spyOn(reviewService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ review });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: review }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(reviewService.update).toHaveBeenCalledWith(review);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const review = new Review();
        spyOn(reviewService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ review });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: review }));
        saveSubject.complete();

        // THEN
        expect(reviewService.create).toHaveBeenCalledWith(review);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const review = { id: 'ABC' };
        spyOn(reviewService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ review });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(reviewService.update).toHaveBeenCalledWith(review);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
