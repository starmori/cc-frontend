import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { API } from '@campus-cloud/config/api';
import { HTTPService } from '@campus-cloud/base';
import { baseActions } from '@campus-cloud/store/base';
import { PersonaPermission } from './audience.status';

@Injectable()
export class AudienceService extends HTTPService {
  constructor(http: HttpClient, router: Router, private store: Store<any>) {
    super(http, router);

    Object.setPrototypeOf(this, AudienceService.prototype);
  }

  getUsers(search: HttpParams): Observable<any> {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER}/`;

    return super.get(url, search);
  }

  getAudiences(search: HttpParams, startRange: number, endRange: number): Observable<any> {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search);
  }

  getAudienceById(audienceId: number, search: HttpParams): Observable<any> {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}/${audienceId}`;

    return super.get(url, search);
  }

  deleteAudience(audienceId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}/${audienceId}`;

    return super.delete(url, search);
  }

  createAudience(body: any, search: HttpParams): Observable<any> {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}/`;

    return super.post(url, body, search);
  }

  updateAudience(audienceId: number, body: any, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}/${audienceId}`;

    return super.update(url, body, search);
  }

  getUploadImageUrl() {
    return `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
  }

  getPersona(search: HttpParams, startRange: number, endRange: number): Observable<any> {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.PERSONAS}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, search, true).pipe(
      map((res: any) => res.filter((p) => p.login_requirement !== PersonaPermission.forbidden)),
      catchError(() => of([]))
    );
  }

  setModalServices(services: any[]): void {
    this.store.dispatch({
      type: baseActions.SERVICES_MODAL_SET,
      payload: services
    });
  }
}
