import { HEADER_UPDATE } from './../../../../reducers/header.reducer';
import { STATUS } from './../../../../shared/constants/status';
import { SNACKBAR_SHOW } from './../../../../reducers/snackbar.reducer';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Store, StoreModule } from '@ngrx/store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';

import { CPSession } from './../../../../session/index';
import { EngagementService } from './engagement.service';
import { mockUser } from './../../../../session/mock/user';
import { EngagementComponent } from './engagement.component';
import { mockSchool } from './../../../../session/mock/school';
import { snackBarReducer, headerReducer } from '../../../../reducers';

const mockFilterState = {
  'engagement': {
    'route_id': 'all',
    'label': 'All Engagements',
    'data': {
      'type': null,
      'value': 0,
      'queryParam': 'scope'
    }
  },
  'for': {
    'route_id': 'all_students',
    'label': 'All Students',
    'listId': null
  },
  'range': {
    'route_id': 'last_week',
    'label': 'Last 7 Days',
    'payload': {
      'metric': 'daily',
      'range': {
        'end': 1508180917,
        'start': 1507608000
      }
    }
  }
}

class MockEngagementService {
  getChartData() {
    return Observable.of('hello');
  }
}

class MockSession {
  g = new Map();
};

class MockRouter {
  navigate(url: string) { return url; }
};

describe('EngagementComponent', () => {
  let storeSpy;
  let store: Store<any>;
  // let session: CPSession;
  let component: EngagementComponent;
  let fixture: ComponentFixture<EngagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // EngagementModule,
        StoreModule.forRoot({
          HEADER: headerReducer,
          SNACKBAR: snackBarReducer
        })
      ],
      declarations: [ EngagementComponent ],
      providers: [
        { provide: Router,  useClass: MockRouter },
        { provide: CPSession, useClass: MockSession },
        { provide: EngagementService, useClass: MockEngagementService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .overrideComponent(EngagementComponent, {
      set: {
        template: '<div>No need of child components</div>'
      }
    })

    store = TestBed.get(Store);
    storeSpy = spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(EngagementComponent);
    component = fixture.componentInstance;

    component.session.g.set('user', mockUser);
    component.session.g.set('school', mockSchool);

    fixture.detectChanges();
  });

  it('onDoCompose', () => {
    const expected = { to: 'me', message: 'hello world' };

    expect(component.messageData).not.toBeDefined();
    expect(component.isComposeModal).toBeFalsy();

    component.onDoCompose(expected);

    expect(component.isComposeModal).toBeTruthy();
    expect(component.messageData).toEqual(expected);
  })

  it('onFlashMessage', () => {
    component.onFlashMessage();

    const expected = {
      type: SNACKBAR_SHOW,
      payload: {
        body: STATUS.MESSAGE_SENT,
        autoClose: true
      }
    };
    expect(storeSpy).toHaveBeenCalledWith(expected);
  })

  it('ngOnInit', () => {
    component.ngOnInit();

    const expected = {
      type: HEADER_UPDATE,
      payload: require('../assess.header.json')
    };
    expect(storeSpy).toHaveBeenCalledWith(expected);
  })

  it('onComposeTeardown', () => {
    component.onComposeTeardown();

    expect(component.isComposeModal).toBeFalsy();
    expect(component.messageData).toBeNull();
  })

  xit('buildSearchHeaders', () => {
    component.onDoFilter(mockFilterState);
    fixture.detectChanges();
    console.log(component.buildSearchHeaders().paramsMap.toJSON());
  })
})