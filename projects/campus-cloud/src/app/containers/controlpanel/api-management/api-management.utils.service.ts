import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { omit } from 'lodash';

import { AccessType } from './model/api-management.interface';

@Injectable()
export class ApiManagementUtilsService {
  navigateAwaySelection$: Subject<boolean> = new Subject<boolean>();

  static getAPIKeyPrefix(key: string) {
    const prefix = key.split('_');

    return `${prefix[0]}_`;
  }

  static getPermissionData(object) {
    return Object.keys(object).length ? object : null;
  }

  static getTokenPermission(hasPermission, type, tokenPermissionData) {
    if (hasPermission) {
      return {
        ...tokenPermissionData,
        [type]: AccessType.write
      };
    }

    return omit(tokenPermissionData, [type]);
  }
}
