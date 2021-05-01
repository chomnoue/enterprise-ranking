import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICompany, Company } from '../company.model';

import { CompanyService } from './company.service';

describe('Service Tests', () => {
  describe('Company Service', () => {
    let service: CompanyService;
    let httpMock: HttpTestingController;
    let elemDefault: ICompany;
    let expectedResult: ICompany | ICompany[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(CompanyService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        companyId: 'AAAAAAA',
        country: 'AAAAAAA',
        industry: 'AAAAAAA',
        description: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find('ABC').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Company', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Company()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Company', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            country: 'BBBBBB',
            industry: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Company', () => {
        const patchObject = Object.assign({}, new Company());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Company', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            country: 'BBBBBB',
            industry: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Company', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addCompanyToCollectionIfMissing', () => {
        it('should add a Company to an empty array', () => {
          const company: ICompany = { companyId: 'ABC' };
          expectedResult = service.addCompanyToCollectionIfMissing([], company);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(company);
        });

        it('should not add a Company to an array that contains it', () => {
          const company: ICompany = { companyId: 'ABC' };
          const companyCollection: ICompany[] = [
            {
              ...company,
            },
            { companyId: 'CBA' },
          ];
          expectedResult = service.addCompanyToCollectionIfMissing(companyCollection, company);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Company to an array that doesn't contain it", () => {
          const company: ICompany = { companyId: 'ABC' };
          const companyCollection: ICompany[] = [{ companyId: 'CBA' }];
          expectedResult = service.addCompanyToCollectionIfMissing(companyCollection, company);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(company);
        });

        it('should add only unique Company to an array', () => {
          const companyArray: ICompany[] = [{ companyId: 'ABC' }, { companyId: 'CBA' }, { companyId: 'Fantastic' }];
          const companyCollection: ICompany[] = [{ companyId: 'ABC' }];
          expectedResult = service.addCompanyToCollectionIfMissing(companyCollection, ...companyArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const company: ICompany = { companyId: 'ABC' };
          const company2: ICompany = { companyId: 'CBA' };
          expectedResult = service.addCompanyToCollectionIfMissing([], company, company2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(company);
          expect(expectedResult).toContain(company2);
        });

        it('should accept null and undefined values', () => {
          const company: ICompany = { companyId: 'ABC' };
          expectedResult = service.addCompanyToCollectionIfMissing([], null, company, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(company);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
