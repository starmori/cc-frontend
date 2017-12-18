import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { CPDate } from './../../../shared/utils/date/date';
import { CPI18nService } from './../../../shared/services/i18n.service';

const cpI18n = new CPI18nService();

const todayDate = moment().hours(23).minutes(59).seconds(59);
const yesterdayDate = moment(todayDate).subtract(1, 'days');
const yesterdayEnd = CPDate.toEpoch(yesterdayDate.toDate());

const last30Days = CPDate.toEpoch(moment(yesterdayDate)
  .subtract(30, 'days').hours(0).minutes(0).seconds(0));

const last90Days = CPDate.toEpoch(moment(yesterdayDate)
  .subtract(90, 'days').hours(0).minutes(0).seconds(0));

const lastYear = CPDate.toEpoch(moment(yesterdayDate)
  .subtract(1, 'year').hours(0).minutes(0).seconds(0));

@Injectable()
export class DashboardUtilsService {
  isSuperAdmin(session) {
    return session.isSuperAdmin();
  }

  dayStart(date) {
    return CPDate.toEpoch(moment(date).hours(0).minutes(0).seconds(0))
  }

  dayEnd(date) {
    return CPDate.toEpoch(moment(date).hours(23).minutes(59).seconds(59).toDate())
  }

  last30Days() {
    return {
      end: yesterdayEnd,
      start: last30Days,
      label: cpI18n.translate('dashboard_last_30_days')
    }
  }

  last90Days() {
    return {
      end: yesterdayEnd,
      start: last90Days,
      label: cpI18n.translate('dashboard_last_90_days')
    }
  }

  lastYear() {
    return {
      end: yesterdayEnd,
      start: lastYear,
      label: cpI18n.translate('dashboard_last_year')
    }
  }

  allTime() {
    return {
      end: yesterdayEnd,
      start: 1,
      label: cpI18n.translate('dashboard_all_time')
    }
  }
}
