import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICompany } from '../company.model';
import { CompanyService } from '../service/company.service';

@Component({
  templateUrl: './company-delete-dialog.component.html',
})
export class CompanyDeleteDialogComponent {
  company?: ICompany;

  constructor(protected companyService: CompanyService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.companyService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
