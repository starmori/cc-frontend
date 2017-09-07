import {
  Input,
  OnInit,
  Output,
  Component,
  ElementRef,
  EventEmitter,
  HostListener
} from '@angular/core';

import { URLSearchParams } from '@angular/http';

import { ListsService } from '../lists.service';
import { CPSession } from '../../../../../session';

declare var $: any;

const LIST_USED_IN_TEMPLATE = 409;

@Component({
  selector: 'cp-lists-delete',
  templateUrl: './lists-delete.component.html',
  styleUrls: ['./lists-delete.component.scss']
})
export class ListsDeleteComponent implements OnInit {
  @Input() list: any;
  @Output() deleteList: EventEmitter<number> = new EventEmitter();

  templateConflict = false;

  constructor(
    private el: ElementRef,
    private session: CPSession,
    private service: ListsService
  ) { }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  resetModal() {
    $('#listsDelete').modal('hide');
    this.templateConflict = false;
  }

  onDelete() {
    let search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    this
      .service
      .removeList(this.list.id, search)
      .subscribe(
        _ => {
          $('#listsDelete').modal('hide');
          this.deleteList.emit(this.list.id);
        },
        err => {
          if (err.status === LIST_USED_IN_TEMPLATE) {
            this.templateConflict = true;
            return;
          } else {
            console.log(err);
          }
        }
      );
  }

  ngOnInit() { }
}