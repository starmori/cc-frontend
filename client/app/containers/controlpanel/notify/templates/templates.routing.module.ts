import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TemplatesListComponent } from './list';

const templatesRoutes: Routes = [
  {
    path: '',
    component: TemplatesListComponent,
    data: { zendesk: 'templates' },
  },
];
@NgModule({
  imports: [RouterModule.forChild(templatesRoutes)],
  exports: [RouterModule],
})
export class TemplatesRoutingModule {}
