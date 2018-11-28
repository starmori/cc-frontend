import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';

import * as fromStore from '../store';

import { emptyForm, fillForm } from '../tests';
import { CPSession } from './../../../../../../session';
import { configureTestSuite } from '../../../../../../shared/tests';
import { mockSchool } from './../../../../../../session/mock/school';
import { SharedModule } from './../../../../../../shared/shared.module';
import { EventsIntegrationsCreateComponent } from './integrations-create.component';

describe('EventsIntegrationsCreateComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, StoreModule.forRoot({})],
        providers: [CPSession],
        declarations: [EventsIntegrationsCreateComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let session: CPSession;
  let tearDownSpy: jasmine.Spy;
  let formResetSpy: jasmine.Spy;
  let closeButton: HTMLSpanElement;
  let cancelButton: HTMLButtonElement;
  let component: EventsIntegrationsCreateComponent;

  let fixture: ComponentFixture<EventsIntegrationsCreateComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsIntegrationsCreateComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);

    session.g.set('school', mockSchool);

    const closeButtonDebugEl = fixture.debugElement.query(By.css('.cpmodal__header__close'));

    const cancelButtonDebugEl = fixture.debugElement.query(By.css('.cpbtn--cancel'));

    closeButton = closeButtonDebugEl.nativeElement;
    cancelButton = cancelButtonDebugEl.nativeElement;

    fixture.detectChanges();

    tearDownSpy = spyOn(component.teardown, 'emit');
    formResetSpy = spyOn(component.integration.form, 'reset');
  });

  it('should init', () => {
    expect(component).toBeTruthy();
  });

  it('should emit teardown event on reset', () => {
    component.resetModal();
    expect(tearDownSpy).toHaveBeenCalled();
    expect(formResetSpy).toHaveBeenCalled();
  });

  it('should call resetModal on close button click', () => {
    spyOn(component, 'resetModal');

    closeButton.click();

    expect(component.resetModal).toHaveBeenCalled();
  });

  it('should call resetModal on cancel button click', () => {
    spyOn(component, 'resetModal');

    cancelButton.click();

    expect(component.resetModal).toHaveBeenCalled();
  });

  it('should create an empty form', () => {
    component.ngOnInit();

    const result = component.integration.form.value;
    expect(result).toEqual(emptyForm);
  });

  it('should dispatch PostIntegration action', () => {
    component.ngOnInit();
    spyOn(component, 'resetModal');
    const dispatchSpy = spyOn(component.store, 'dispatch');

    fillForm(component.integration.form);

    component.doSubmit();

    const expected = new fromStore.PostIntegration(component.integration.form.value);

    expect(component.resetModal).toHaveBeenCalled();
    expect(component.store.dispatch).toHaveBeenCalled();

    const { payload, type } = dispatchSpy.calls.mostRecent().args[0];
    const { body } = payload;

    expect(body).toEqual(expected.payload);
    expect(type).toEqual(fromStore.IntegrationActions.POST_INTEGRATION);
  });
});