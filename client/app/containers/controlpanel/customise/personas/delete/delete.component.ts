import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { CPSession } from './../../../../../session';
import { PersonasService } from './../personas.service';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-personas-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class PersonasDeleteComponent implements OnInit {
  @Input() persona: any;

  @Output() deleted: EventEmitter<null> = new EventEmitter();
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() errorEvent: EventEmitter<any> = new EventEmitter();

  buttonData;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: PersonasService
  ) {}

  onDelete() {
    const search = new URLSearchParams();
    search.append('force', 'true');
    search.append('school_id', this.session.g.get('school').id);

    this.service.deletePersonaById(this.persona.id, search).subscribe(
      () => {
        this.resetModal();
        this.deleted.emit();
      },
      (err) => {
        this.resetModal();
        this.errorEvent.emit(err);
      }
    );
  }

  resetModal() {
    $('#personaDeleteModal').modal('hide');

    this.buttonData = Object.assign({}, this.buttonData, { disabled: false });

    this.teardown.emit();
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };
  }
}
