import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../config/api';
import { BaseService } from '../../../base/base.service';

@Injectable()
export class AccountService extends BaseService {
  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, AccountService.prototype);
  }

  resetPassword(body: any, userid: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ADMIN}/${userid}`;

    return super.update(url, body);
  }
}
