import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

import { DashboardService } from './dashboard.service';
import { DashboardUtilsService } from './dashboard.utils.service';

import {
  DashboardTopEventsComponent,
  DashboardDatePickerComponent,
  DashboardTopResourceComponent,
  DashboardTopServicesComponent,
  DashboardDownloadsChartComponent,
  DashboardGeneralInformationComponent
} from './components';

import { DashboardComponent }  from './dashboard.component';
import { DashboardRoutingModule } from './dashboard.routing.module';

@NgModule({
  declarations: [ DashboardComponent, DashboardDatePickerComponent,
  DashboardDownloadsChartComponent, DashboardGeneralInformationComponent,
  DashboardTopEventsComponent, DashboardTopServicesComponent,
  DashboardTopResourceComponent ],

  imports: [ CommonModule, SharedModule, DashboardRoutingModule ],

  providers: [ DashboardService, DashboardUtilsService ],
})
export class DashboardModule {}
