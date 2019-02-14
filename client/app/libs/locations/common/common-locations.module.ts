import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LocationsDayLabelPipe } from './pipes';
import { SharedModule } from '@client/app/shared/shared.module';
import {
  LocationFormComponent,
  LocationsInfoCardComponent,
  LocationsMetaDataComponent,
  DiningOpeningHoursComponent,
  LocationsCommonListComponent,
  LocationsListTopBarComponent,
  LocationsOpeningHoursComponent,
  LocationsInfoResourceBannerComponent
} from './components';

@NgModule({
  declarations: [
    LocationsDayLabelPipe,
    LocationFormComponent,
    LocationsInfoCardComponent,
    LocationsMetaDataComponent,
    DiningOpeningHoursComponent,
    LocationsCommonListComponent,
    LocationsListTopBarComponent,
    LocationsOpeningHoursComponent,
    LocationsInfoResourceBannerComponent
  ],
  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule],
  exports: [
    LocationsDayLabelPipe,
    LocationFormComponent,
    LocationsInfoCardComponent,
    LocationsMetaDataComponent,
    DiningOpeningHoursComponent,
    LocationsCommonListComponent,
    LocationsListTopBarComponent,
    LocationsOpeningHoursComponent,
    LocationsInfoResourceBannerComponent
  ]
})
export class CommonLocationsModule {}
