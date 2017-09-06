import { Component, OnInit, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { generateExcelFile } from './excel';
import { ProvidersService } from '../../../../../providers.service';
import { FORMAT } from '../../../../../../../../../shared/pipes/date.pipe';
import { BaseComponent } from '../../../../../../../../../base/base.component';

interface IState {
  search_text: string;
}

const state: IState = {
  search_text: null
};

@Component({
  selector: 'cp-providers-attendees-list',
  templateUrl: './providers-attendees-list.component.html',
  styleUrls: ['./providers-attendees-list.component.scss']
})
export class ServicesProvidersAttendeesListComponent extends BaseComponent implements OnInit {
  @Input() serviceId: number;
  @Input() providerId: number;
  @Input() query: Observable<string>;
  @Input() download: Observable<boolean>;

  loading;
  assessments;
  checkinMethods;
  state: IState = state;
  dateFormat = FORMAT.DATETIME;

  constructor(
    private providersService: ProvidersService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
  }

  fetch() {
    let search = new URLSearchParams();
    search.append('search_text', this.state.search_text);
    search.append('service_id', this.serviceId.toString());
    search.append('service_provider_id', this.providerId.toString());

    const stream$ = this
      .providersService
      .getProviderAssessments(this.startRange, this.endRange, search);

    super
      .fetchData(stream$)
      .then(res => {
        this.assessments = res.data;
      })
      .catch(err => console.log(err));
  }

  onPaginationNext() {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetch();
  }

  fetchAllRecords(): Promise<any> {
    const search = new URLSearchParams();
    search.append('all', 'true');
    search.append('service_id', this.serviceId.toString());
    search.append('service_provider_id', this.providerId.toString());

    const stream$ = this
      .providersService
      .getProviderAssessments(1, 5000, search);

    return stream$.toPromise()
  }

  ngOnInit() {
    this.download.subscribe(download => {
      if (download && this.assessments.length) {
        this
          .fetchAllRecords()
          .then(assessments => generateExcelFile(assessments))
          .catch(_ => console.log('no data'));
        ;
      }
    });

    this.query.subscribe(search_text => {
      this.state = Object.assign({}, this.state, { search_text });
      this.fetch();
    });

    this.checkinMethods = {
      '1': {
        label: 'Web check-in'
      },
      '2': {
        label: 'Web Based QR scan'
      },
      '3': {
        label: 'App check-in'
      }
    };
  }
}
