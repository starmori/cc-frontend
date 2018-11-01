import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { BaseComponent } from '../../../../../base';
import { CPSession } from './../../../../../session';
import { DashboardService } from './../../dashboard.service';

@Component({
  selector: 'cp-dashboard-general-information',
  templateUrl: './dashboard-general-information.component.html',
  styleUrls: ['./dashboard-general-information.component.scss']
})
export class DashboardGeneralInformationComponent extends BaseComponent implements OnInit {
  @Output() ready: EventEmitter<boolean> = new EventEmitter();

  data;
  _dates = null;

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  loading;

  constructor(private session: CPSession, private service: DashboardService) {
    super();
    super.isLoading().subscribe((loading) => {
      this.loading = loading;
      this.ready.emit(!this.loading);
    });
  }

  fetch(personaId = null) {
    const search = new HttpParams()
      .append('end', this._dates.end)
      .append('start', this._dates.start)
      .append('persona_id', personaId)
      .append('school_id', this.session.g.get('school').id);

    const stream$ = this.service.getGeneralInformation(search);

    super.fetchData(stream$).then((res) => {
      this.data = res.data;
    });
  }

  onExperienceSelected(personaId) {
    console.log('i want to fetch with', personaId, 'loading?', this.loading);
    // this.fetch(personaId);
  }

  ngOnInit() {}
}
