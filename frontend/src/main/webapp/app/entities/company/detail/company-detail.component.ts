import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ICompany} from '../company.model';
import {CompanyService} from "app/entities/company/service/company.service";

@Component({
  selector: 'jhi-company-detail',
  templateUrl: './company-detail.component.html',
})
export class CompanyDetailComponent implements OnInit {
  company: ICompany | null = null;
  slides = [{'image': 'https://gsr.dev/material2-carousel/assets/demo.png'}, {'image': 'https://gsr.dev/material2-carousel/assets/demo.png'}, {'image': 'https://gsr.dev/material2-carousel/assets/demo.png'}, {'image': 'https://gsr.dev/material2-carousel/assets/demo.png'}, {'image': 'https://gsr.dev/material2-carousel/assets/demo.png'}];
  currImage = 0;
  fileToUpload: File | null | undefined = null;

  constructor(protected companyService: CompanyService, protected activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({company}) => {
      this.company = company;
    });
  }

  previousState(): void {
    window.history.back();
  }

  nextImage(): void {
    if (this.currImage < (this.company?.imageUrls?.length ?? 0) - 1) {
      this.currImage++;
    } else {
      this.currImage = 0;
    }
  }

  prevImage(): void {
    if (this.currImage > 0) {
      this.currImage--;
    } else {
      this.currImage = (this.company?.imageUrls?.length ?? 0) - 1;
    }
  }

  handleFileInput(element: EventTarget | null): void {
    const filesElement = element as HTMLInputElement
    this.fileToUpload = filesElement.files?.item(0);
  }

  uploadFile(): void {
    if (this.fileToUpload && this.company?.companyId) {
      this.companyService.uploadFile(this.fileToUpload, this.company.companyId).subscribe(url => this.addImageUrl(url))
    }
  }

  private addImageUrl(url: string): void {
    if (this.company?.imageUrls) {
      this.company.imageUrls.push(url)
    } else if (this.company) {
      this.company.imageUrls = [url]
    }
    this.fileToUpload = null;
  }
}
