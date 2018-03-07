import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { URLSearchParams } from '@angular/http';

import { CPSession } from './../../../../../session';
import { OrientationService } from '../orientation.services';
import { CPI18nService } from '../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-orientation-program-edit',
  templateUrl: './orientation-program-edit.component.html',
  styleUrls: ['./orientation-program-edit.component.scss'],
})
export class OrientationProgramEditComponent implements OnInit {
  @ViewChild('editForm') editForm;

  @Input() orientationProgram;
  @Input() isOrientation = false;

  @Output()
  edited: EventEmitter<{
    id: number;
    name: string;
    description: string;
  }> = new EventEmitter();
  @Output() resetEditModal: EventEmitter<null> = new EventEmitter();

  buttonData;
  form: FormGroup;

  constructor(
    public el: ElementRef,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: OrientationService,
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  resetModal() {
    this.resetEditModal.emit();
    this.editForm.form.reset();
    $('#programEdit').modal('hide');
  }

  onSubmit() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    this.service
      .editOrientationProgram(this.orientationProgram.id, this.form.value, search)
      .subscribe((editedProgram) => {
        this.edited.emit(editedProgram);
        this.resetModal();
      });
    this.edited.emit(this.editForm.form.value);
    this.resetModal();
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [
        this.orientationProgram.name,
        [Validators.required, Validators.maxLength(225)],
      ],
      description: [
        this.orientationProgram.description,
        Validators.maxLength(512)
      ],
      has_membership: [
        this.orientationProgram.has_membership
      ],
    });

    this.buttonData = Object.assign({}, this.buttonData, {
      class: 'primary',
      disabled: !this.form.valid,
      text: this.cpI18n.translate('save')
    });

    this.form.valueChanges.subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.form.valid };
    });
  }
}
