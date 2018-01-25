import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { CustomizationListComponent } from './list';
import { CustomizationService } from './customization.service';
import { SharedModule } from '../../../../shared/shared.module';

import {
  CustomizationUploadButtonComponent,
  CustomizationControlButtonsComponent,
} from './list/components';

import { CustomizationRoutingModule } from './customization.routing.module';

@NgModule({
  declarations: [
    CustomizationListComponent,
    CustomizationUploadButtonComponent,
    CustomizationControlButtonsComponent,
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    CustomizationRoutingModule,
  ],

  providers: [CustomizationService],
})
export class CustomizationModule {}
