import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CompanyComponent } from '../list/company.component';
import { CompanyDetailComponent } from '../detail/company-detail.component';
import { CompanyUpdateComponent } from '../update/company-update.component';
import { CompanyRoutingResolveService } from './company-routing-resolve.service';

const companyRoute: Routes = [
  {
    path: '',
    component: CompanyComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CompanyDetailComponent,
    resolve: {
      company: CompanyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CompanyUpdateComponent,
    resolve: {
      company: CompanyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CompanyUpdateComponent,
    resolve: {
      company: CompanyRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':companyId/reviews',
    data: { pageTitle: 'enterpriseRankingApp.review.home.title' },
    loadChildren: () => import('../../review/review.module').then(m => m.ReviewModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(companyRoute)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
