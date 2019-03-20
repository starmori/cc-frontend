import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import * as fromStore from '../store';
import { CPSession } from '@app/session';
import { CPI18nService } from '@shared/services';
import { SharedModule } from '@shared/shared.module';
import { configureTestSuite } from '@app/shared/tests';
import { mockLocations } from '@libs/locations/common/tests';
import { LocationsDeleteComponent } from './locations-delete.component';

describe('LocationsDeleteComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, StoreModule.forRoot({}), RouterModule.forRoot([])],
        providers: [CPSession, CPI18nService],
        declarations: [LocationsDeleteComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let fixture: ComponentFixture<LocationsDeleteComponent>;
  let component: LocationsDeleteComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationsDeleteComponent);
    component = fixture.componentInstance;
    component.location = mockLocations[0];
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch DeleteLocation action', () => {
    const dispatchSpy = spyOn(component.store, 'dispatch');

    component.onDelete();

    expect(component.store.dispatch).toHaveBeenCalled();

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0];

    expect(payload).toBe(mockLocations[0]);
    expect(type).toBe(fromStore.locationActions.DELETE_LOCATION);
  });
});
