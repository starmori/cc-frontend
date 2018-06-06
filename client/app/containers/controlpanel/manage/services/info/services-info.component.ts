/*tslint:disable:max-line-length */
import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { BehaviorSubject, of as observableOf } from 'rxjs';
import { combineLatest, map } from 'rxjs/operators';
import {
  canSchoolReadResource,
  canStoreReadAndWriteResource
} from './../../../../../shared/utils/privileges';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';
import { CPSession, ISchool } from '../../../../../session';
import { IResourceBanner } from '../../../../../shared/components/cp-resource-banner/cp-resource.interface';
import { CP_PRIVILEGES_MAP } from '../../../../../shared/constants';
import { AdminService } from '../../../../../shared/services';
import { ServicesService } from '../services.service';

@Component({
  selector: 'cp-services-info',
  templateUrl: './services-info.component.html',
  styleUrls: ['./services-info.component.scss']
})
export class ServicesInfoComponent extends BaseComponent implements OnInit {
  @Input() resourceBanner: IResourceBanner;

  admins;
  service;
  storeId;
  loading = true;
  school: ISchool;
  serviceId: number;
  draggable = false;
  mapCenter: BehaviorSubject<any>;

  constructor(
    private session: CPSession,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private serviceService: ServicesService
  ) {
    super();
    this.school = this.session.g.get('school');
    super.isLoading().subscribe((res) => (this.loading = res));
    this.serviceId = this.route.snapshot.params['serviceId'];

    this.fetch();
  }

  private fetch() {
    const search: HttpParams = new HttpParams()
      .append('school_id', this.school.id.toString())
      .append('store_id', this.serviceId.toString())
      .append('privilege_type', CP_PRIVILEGES_MAP.services.toString());

    const service$ = this.serviceService.getServiceById(this.serviceId);

    const admins$ = this.adminService.getAdminByStoreId(search).pipe(
      map((admins: Array<any>) => {
        const _admins = [];
        admins.forEach((admin) => {
          if (!admin.is_school_level) {
            _admins.push(admin);
          }
        });

        return _admins;
      })
    );

    const stream$ = observableOf(combineLatest(service$, admins$));
    super.fetchData(stream$).then((res) => {
      this.admins = res.data[1];
      this.service = res.data[0];
      this.storeId = this.service.store_id;

      this.buildHeader();

      this.mapCenter = new BehaviorSubject({
        lat: res.data[0].latitude,
        lng: res.data[0].longitude
      });

      this.resourceBanner = {
        image: this.service.logo_url,
        heading: this.service.name
      };
    });
  }

  private buildHeader() {
    let children = [
      {
        label: 'info',
        url: `/manage/services/${this.serviceId}/info`
      }
    ];
    const eventsSchoolLevel = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.events);
    const eventsAccountLevel = canStoreReadAndWriteResource(
      this.session.g,
      this.storeId,
      CP_PRIVILEGES_MAP.events
    );

    if (eventsSchoolLevel || eventsAccountLevel) {
      const events = {
        label: 'events',
        url: `/manage/services/${this.serviceId}/events`
      };

      children = [...children, events];
    }

    if (this.service.service_attendance) {
      const attendance = {
        label: 'assessment',
        url: `/manage/services/${this.serviceId}`
      };

      children = [...children, attendance];
    }

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: `[NOTRANSLATE]${this.service.name}[NOTRANSLATE]`,
        crumbs: {
          url: 'services',
          label: 'services'
        },
        subheading: '',
        children: [...children]
      }
    });
  }

  ngOnInit() {}
}
