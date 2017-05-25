import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * CRUD
 */
import { ClubsEventsComponent } from './clubs-events.component';

import {
  ClubsEventEditComponent,
  ClubsEventInfoComponent,
  ClubsEventsCreateComponent,
  ClubsEventsFacebookComponent,
  ClubsEventsAttendanceComponent
} from './components';

/**
 * Imports
 */
import { EventsExcelComponent }  from '../../events/excel';


const appRoutes: Routes = [
  { path: 'import', redirectTo: '', pathMatch: 'full' },

  { path: '', component: ClubsEventsComponent },
  { path: 'create', component: ClubsEventsCreateComponent },
  { path: ':eventId', component: ClubsEventsAttendanceComponent },
  { path: ':eventId/edit', component: ClubsEventEditComponent },
  { path: ':eventId/info', component: ClubsEventInfoComponent },

  { path: 'import/excel', component: EventsExcelComponent },
  { path: 'import/facebook', component: ClubsEventsFacebookComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ClubsEventsRoutingModule {}
