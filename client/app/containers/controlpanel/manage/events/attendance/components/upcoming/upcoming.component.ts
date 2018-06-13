/*tslint:disable:max-line-length */
import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { EventAttendance } from '../../../event.status';
import { FORMAT } from '../../../../../../../shared/pipes/date';
import { EventUtilService } from '../../../events.utils.service';
import { IResourceBanner } from '../../../../../../../shared/components/cp-resource-banner/cp-resource.interface';

@Component({
  selector: 'cp-attendance-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss']
})
export class AttendanceUpcomingComponent implements OnInit {
  @Input() event: any;
  @Input() isOrientation: boolean;
  @Input() resourceBanner: IResourceBanner;

  banner;
  mapCenter;
  dateFormat;
  eventCheckinRoute;
  draggable = false;
  format = FORMAT.DATETIME;
  attendanceEnabled = EventAttendance.enabled;

  constructor(public utils: EventUtilService) {}

  ngOnInit() {
    this.eventCheckinRoute = this.utils.getEventCheckInLink(this.isOrientation);
    this.banner = this.event.poster_url === '' ? this.event.store_logo_url : this.event.poster_url;

    this.dateFormat = FORMAT.DATETIME;
    this.mapCenter = new BehaviorSubject({
      lat: this.event.latitude,
      lng: this.event.longitude
    });

    this.resourceBanner = {
      image: this.banner,
      heading: this.event.title,
      subheading: this.event.store_name
    };
  }
}
