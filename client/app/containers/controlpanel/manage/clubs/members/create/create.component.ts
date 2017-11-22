import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import {
  Input,
  OnInit,
  Output,
  ViewChild,
  Component,
  ElementRef,
  EventEmitter,
  AfterViewInit
} from '@angular/core';

import { MemberType } from '../member.status';
import { MembersService } from '../members.service';
import { CPSession } from '../../../../../../session';
import { CPI18nService } from '../../../../../../shared/services/index';

declare var $: any;

@Component({
  selector: 'cp-members-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class ClubsMembersCreateComponent implements OnInit, AfterViewInit {
  @Input() groupId: number;
  @ViewChild('input') input: ElementRef;
  @Output() added: EventEmitter<any> = new EventEmitter();

  buttonData;
  formErrors;
  memberTypes;
  members = [];
  form: FormGroup;
  isExecutive = MemberType.executive;
  reset$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private service: MembersService
  ) { }

  ngAfterViewInit() {
    const keyup$ = Observable.fromEvent(this.input.nativeElement, 'keyup');
    const blur$ = Observable.fromEvent(this.input.nativeElement, 'blur');

    blur$
      .debounceTime(200)
      .subscribe(_ => { if (this.members.length) { this.members = []; } });

    keyup$
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap((event: KeyboardEvent) => {
        const target = <HTMLInputElement>event.target;
        const query = target.value;

        if (!query) { return Observable.of([]); }

        let search = new URLSearchParams();
        search.append('search_str', query);
        search.append('school_id', this.session.g.get('school').id.toString());

        return this
          .service
          .getMembers(search)
          .map(members => {
            if (!(members.length)) {
              return [{ 'label': this.cpI18n.translate('no_results') }]
            }

            return members.map(member => {
              return {
                'label': `${member.firstname} ${member.lastname}`,
                'id': member.id
              }
            })
          });
      })
      .subscribe(members => this.members = members);
  }

  onMemberSelected(member) {
    if (!member.id) { return; }

    this.members = [];
    this.input.nativeElement.value = member.label;
    this.form.controls['member'].setValue(member.id);
  }

  onTypeChange(type): void {
    let control = this.form.controls['member_type'];
    control.setValue(type);
  }

  doReset() {
    this.form.controls['member'].setValue(null);
    this.form.controls['member_type'].setValue(this.memberTypes[0].action);
    this.input.nativeElement.value = null;
  }

  onSave() {
    this.formErrors = false;

    if (!this.form.valid) {
      this.formErrors = true;
      return;
    }

    if (this.form.value.member_type !== MemberType.executive) {
      this.form.controls['member_position'].setValue(null);
    }

    let group_id = this.groupId;
    let member_position = this.form.value.member_position;
    let member_type = this.form.value.member_type;

    this
      .service
      .addMember({ member_type, group_id, member_position }, this.form.value.member)
      .subscribe(
      member => {
        this.added.emit(member);
        $('#membersCreate').modal('hide');
        this.doReset();
        this.buttonData = Object.assign({}, this.buttonData, { disabled: true });
        this.reset$.next(true);
      },
      err => {
        this.buttonData = Object.assign({}, this.buttonData, { disabled: true });
        throw new Error(err)
      }
      );
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('save'),
      disabled: true,
      class: 'primary'
    }

    this.memberTypes = [
      {
        label: this.cpI18n.translate('member'),
        action: MemberType.member
      },
      {
        label: this.cpI18n.translate('executive'),
        action: MemberType.executive
      }
    ];

    this.form = this.fb.group({
      'member': [null, Validators.required],
      'member_type': [this.memberTypes[0].action, Validators.required],
      'member_position': [null]
    });

    this.form.valueChanges.subscribe(_ => {
      this.buttonData = Object.assign({}, this.buttonData, { disabled: !this.form.valid });
    })
  }
}
