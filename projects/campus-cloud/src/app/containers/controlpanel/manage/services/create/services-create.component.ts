import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { IService } from '../service.interface';
import { CPMap } from '@campus-cloud/shared/utils';
import { ServicesService } from '../services.service';
import { ServiceAttendance } from '../services.status';
import { CPSession, ISchool } from '@campus-cloud/session';
import { baseActions, IHeader } from '@campus-cloud/store/base';
import { CustomValidators } from '@campus-cloud/shared/validators';
import { ServicesUtilsService } from '../services.utils.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-services-create',
  templateUrl: './services-create.component.html',
  styleUrls: ['./services-create.component.scss']
})
export class ServicesCreateComponent implements OnInit {
  buttonData;
  errorMessage;
  categoryTooltip;
  storeId: number;
  school: ISchool;
  form: FormGroup;
  formError = false;
  defaultMembership;
  attendance = false;
  showLocationDetails = false;
  categories$: Observable<any>;
  mapCenter: BehaviorSubject<any>;
  newAddress = new BehaviorSubject(null);
  drawMarker = new BehaviorSubject(false);
  membershipTypes = this.utils.membershipTypes;

  eventProperties = {
    phone: null,
    email: null,
    website: null,
    location: null,
    service_id: null,
    assessment: null,
    category_name: null
  };

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public store: Store<IHeader>,
    public cpI18n: CPI18nService,
    public utils: ServicesUtilsService,
    public cpTracking: CPTrackingService,
    public servicesService: ServicesService
  ) {
    this.buildHeader();
    this.categories$ = this.servicesService.getCategories().pipe(
      startWith([{ label: '---', action: null }]),
      map((categories: any[]) => {
        const _categories = [
          {
            label: '---',
            action: null
          }
        ];
        categories.map((category: any) => {
          _categories.push({
            action: category.id,
            label: category.name
          });
        });

        return _categories;
      })
    );
    this.defaultMembership = this.membershipTypes.find((type) => type.action === false);
  }

  onUploadedImage(image) {
    this.form.controls.logo_url.setValue(image);

    if (image) {
      this.trackUploadImageEvent();
    }
  }

  trackUploadImageEvent() {
    const properties = this.cpTracking.getEventProperties();

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.UPLOADED_PHOTO, properties);
  }

  onResetMap() {
    this.drawMarker.next(false);
    this.form.controls['room_data'].setValue(null);
    CPMap.setFormLocationData(this.form, CPMap.resetLocationFields());
    this.centerMap(this.school.latitude, this.school.longitude);
  }

  onMapSelection(data) {
    const cpMap = CPMap.getBaseMapObject(data);

    const location = { ...cpMap, address: data.formatted_address };

    CPMap.setFormLocationData(this.form, location);

    this.newAddress.next(this.form.controls['address'].value);
  }

  updateWithUserLocation(location) {
    location = Object.assign({}, location, { location: location.name });

    CPMap.setFormLocationData(this.form, location);

    this.centerMap(location.latitude, location.longitude);
  }

  onPlaceChange(data) {
    if (!data) {
      return;
    }

    this.drawMarker.next(true);

    if ('fromUsersLocations' in data) {
      this.updateWithUserLocation(data);

      return;
    }

    const cpMap = CPMap.getBaseMapObject(data);

    const location = { ...cpMap, address: data.name };

    const coords: google.maps.LatLngLiteral = data.geometry.location.toJSON();

    CPMap.setFormLocationData(this.form, location);

    this.centerMap(coords.lat, coords.lng);
  }

  centerMap(lat: number, lng: number) {
    return this.mapCenter.next({ lat, lng });
  }

  onSelectedFeedback(feedback) {
    this.form.controls['enable_feedback'].setValue(feedback.value);
  }

  buildHeader() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: 'services_create_heading',
        subheading: null,
        em: null,
        children: []
      }
    });
  }

  onSelectedMembership(type) {
    this.form.controls['has_membership'].setValue(type.action);
  }

  onSubmit() {
    this.formError = false;

    if (!this.form.valid) {
      this.formError = true;
      this.enableSaveButton();

      return;
    }

    const data = this.form.value;
    data['school_id'] = this.school.id;

    this.servicesService.createService(data).subscribe(
      (service: IService) => {
        const url = service.service_attendance ? '/info' : '';

        this.trackEvent(service, service.id);
        this.router.navigate(['/manage/services/' + service.id + url]);
      },
      (_) => {
        this.enableSaveButton();
        this.errorMessage = this.cpI18n.translate('something_went_wrong');
      }
    );
  }

  onToggleAttendance(event) {
    const serviceAttendance = event ? ServiceAttendance.enabled : ServiceAttendance.disabled;

    this.form.controls['service_attendance'].setValue(serviceAttendance);
  }

  onLocationToggle(value) {
    this.showLocationDetails = value;

    if (!value) {
      this.drawMarker.next(false);

      this.mapCenter = new BehaviorSubject({
        lat: this.school.latitude,
        lng: this.school.longitude
      });

      this.form.controls['room_data'].setValue(null);
      CPMap.setFormLocationData(this.form, CPMap.resetLocationFields());
    }
  }

  onCategoryUpdate(category) {
    this.form.controls['category'].setValue(category.action);

    this.eventProperties = {
      ...this.eventProperties,
      category_name: category.label
    };
  }

  trackEvent(data, serviceId) {
    this.eventProperties = {
      ...this.eventProperties,
      ...this.utils.setEventProperties(data, serviceId)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_CREATED_SERVICE,
      this.eventProperties
    );
  }

  enableSaveButton() {
    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  ngOnInit() {
    this.school = this.session.g.get('school');

    this.categoryTooltip = this.cpI18n.translate('manage_create_service_category_tooltip');

    this.buttonData = {
      disabled: false,
      class: 'primary',
      text: this.cpI18n.translate('services_create_button_create')
    };

    this.storeId = this.school.main_union_store_id;
    this.mapCenter = new BehaviorSubject({
      lat: this.school.latitude,
      lng: this.school.longitude
    });

    this.form = this.fb.group({
      city: [null],
      email: [null],
      latitude: [0],
      longitude: [0],
      address: [null],
      country: [null],
      location: [null],
      province: [null],
      room_data: [null],
      description: [null],
      postal_code: [null],
      contactphone: [null],
      secondary_name: [null],
      has_membership: [null],
      service_attendance: [null],
      rating_scale_maximum: [null],
      logo_url: [null, Validators.required],
      category: [null, Validators.required],
      website: [null, Validators.maxLength(120)],
      default_basic_feedback_label: [this.cpI18n.translate('services_default_feedback_question')],
      name: [null, Validators.compose([Validators.required, CustomValidators.requiredNonEmpty])]
    });
  }
}
