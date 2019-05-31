import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * CRUD
 */
import { ServicesListComponent } from './list';
import { ServicesEditComponent } from './edit';
import { ServicesInfoComponent } from './info';
import { ServicesFeedsComponent } from './feeds';
import { ServicesCreateComponent } from './create';
import { ServicesEventsComponent } from './events';
import { ServicesAttendanceComponent } from './attendance';
import { ServicesListMembersComponent } from './members/list/list.component';

import {
  ServicesEventsEditComponent,
  ServicesEventsInfoComponent,
  ServicesEventsExcelComponent,
  ServicesEventsCreateComponent,
  ServicesEventsAttendanceComponent
} from './events/components';

import { ServicesProviderDetailsComponent } from './attendance/components';

/**
 * Excel
 */
import { pageTitle } from '@shared/constants';
import { ServicesExcelComponent } from './excel';
import { PrivilegesGuard } from '@app/config/guards';
import { ServicesResolver } from './services.resolver';

const appRoutes: Routes = [
  { path: 'import', redirectTo: '', pathMatch: 'full' },

  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: ServicesListComponent,
    data: { zendesk: 'services', title: pageTitle.MANAGE_SERVICES }
  },

  {
    path: 'create',
    canActivate: [PrivilegesGuard],
    component: ServicesCreateComponent,
    data: { zendesk: 'services', title: pageTitle.MANAGE_SERVICES }
  },
  {
    path: ':serviceId/info',
    canActivate: [PrivilegesGuard],
    component: ServicesInfoComponent,
    data: { zendesk: 'services', title: pageTitle.MANAGE_SERVICES }
  },
  {
    path: ':serviceId/edit',
    canActivate: [PrivilegesGuard],
    component: ServicesEditComponent,
    data: { zendesk: 'services', title: pageTitle.MANAGE_SERVICES }
  },
  {
    path: ':serviceId/members',
    canActivate: [PrivilegesGuard],
    component: ServicesListMembersComponent,
    resolve: { service: ServicesResolver },
    data: { zendesk: 'services', title: pageTitle.MANAGE_SERVICES }
  },
  {
    path: ':serviceId/feeds',
    canActivate: [PrivilegesGuard],
    component: ServicesFeedsComponent,
    resolve: { service: ServicesResolver },
    data: { zendesk: 'services', title: pageTitle.MANAGE_SERVICES }
  },
  {
    path: ':serviceId/events',
    canActivate: [PrivilegesGuard],
    component: ServicesEventsComponent,
    data: { zendesk: 'services', title: pageTitle.MANAGE_SERVICES }
  },

  {
    path: ':serviceId/events/create',
    canActivate: [PrivilegesGuard],
    component: ServicesEventsCreateComponent,
    data: { zendesk: 'services', title: pageTitle.MANAGE_SERVICES }
  },
  {
    path: ':serviceId/events/:eventId',
    canActivate: [PrivilegesGuard],
    component: ServicesEventsAttendanceComponent,
    data: { zendesk: 'services', title: pageTitle.MANAGE_SERVICES }
  },
  {
    canActivate: [PrivilegesGuard],
    path: ':serviceId/events/:eventId/info',
    component: ServicesEventsInfoComponent,
    data: { zendesk: 'services', title: pageTitle.MANAGE_SERVICES }
  },

  {
    canActivate: [PrivilegesGuard],
    path: ':serviceId/events/:eventId/edit',
    component: ServicesEventsEditComponent,
    data: { zendesk: 'services', title: pageTitle.MANAGE_SERVICES }
  },
  {
    canActivate: [PrivilegesGuard],
    path: ':serviceId/events/import/excel',
    component: ServicesEventsExcelComponent,
    data: { zendesk: 'services', title: pageTitle.MANAGE_SERVICES }
  },
  {
    path: ':serviceId',
    canActivate: [PrivilegesGuard],
    component: ServicesAttendanceComponent,
    data: { zendesk: 'services', title: pageTitle.MANAGE_SERVICES }
  },

  {
    path: ':serviceId/provider/:providerId',
    canActivate: [PrivilegesGuard],
    component: ServicesProviderDetailsComponent,
    data: { zendesk: 'services', title: pageTitle.MANAGE_SERVICES }
  },

  {
    path: 'import/excel',
    canActivate: [PrivilegesGuard],
    component: ServicesExcelComponent,
    data: { zendesk: 'services', title: pageTitle.MANAGE_SERVICES }
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class ServicesRoutingModule {}
