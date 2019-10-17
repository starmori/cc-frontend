import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Store } from '@ngrx/store';

import { IHeader } from '@campus-cloud/store/base';
import { MockDataExportService } from './../tests/mocks';
import { DataExportModule } from './../data-export.module';
import { DataExportListComponent } from './list.component';
import { DataExportService } from './../data-export.service';
import { DataExportUtilsService } from './../data-export.utils.service';
import { CPTestModule } from '@projects/campus-cloud/src/app/shared/tests';
import { SNACKBAR_ERROR } from '@campus-cloud/store/base/reducers/snackbar.reducer';

describe('DataExportListComponent', () => {
  let store: MockStore<IHeader>;
  let component: DataExportListComponent;
  let fixture: ComponentFixture<DataExportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule, DataExportModule],
      providers: [
        provideMockStore(),
        { provide: DataExportService, useClass: MockDataExportService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataExportListComponent);
    component = fixture.componentInstance;
    store = TestBed.get(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should trigger error snackbar', () => {
    component.errorHandler();
    store.scannedActions$.subscribe(({ payload, type }: any) => {
      const { body } = payload;

      expect(body).toBeDefined();
      expect(type).toBe(SNACKBAR_ERROR);
    });
  });

  describe('onSearch', () => {
    it('should return original list if query is falsy', () => {
      component.reports = [];
      component.onSearch(null);
      fixture.detectChanges();

      expect(component.reports.length).toBe(DataExportUtilsService.reports.length);

      component.reports = [];
      fixture.detectChanges();
      component.onSearch('');

      expect(component.reports.length).toBe(DataExportUtilsService.reports.length);
    });

    it('should filter reports based on query', () => {
      const expected = component.reports[0].name;
      component.onSearch(expected.toUpperCase());

      fixture.detectChanges();

      expect(component.reports.length).toBe(1);
      expect(component.reports[0].name).toBe(expected);
    });
  });

  it('should have a trackByFn function', () => {
    expect(component.trackByFn).toBeDefined();
  });
});