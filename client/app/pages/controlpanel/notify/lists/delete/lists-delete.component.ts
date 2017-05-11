import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

declare var $: any;

@Component({
  selector: 'cp-lists-delete',
  templateUrl: './lists-delete.component.html',
  styleUrls: ['./lists-delete.component.scss']
})
export class ListsDeleteComponent implements OnInit {
  @Input() list: any;
  @Output() deleteList: EventEmitter<number> = new EventEmitter();

  constructor() { }

  onDelete() {
    $('#listsDelete').modal('hide');
    this.deleteList.emit(this.list.id);
  }

  ngOnInit() { }
}
