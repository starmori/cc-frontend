import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

@Injectable()
export class AudienceSharedService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, AudienceSharedService.prototype);
  }

  getFilters(search: URLSearchParams): Observable<any> {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.AUDIENCE_FILTERS}/`;

    return super.get(url, { search }).map((res) => res.json());
  }

  getUserCount(body, search: URLSearchParams): Observable<any> {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}/`;

    return super.post(url, body, { search }).map((res) => res.json());
  }

  getAudience(startRange: number, endRange: number, search: URLSearchParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}`;

    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  getUsers(search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER}/`;

    return super.get(url, { search }).map((res) => res.json());
  }
}