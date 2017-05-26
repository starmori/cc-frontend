import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

interface IItems {
  'label': string;
  'action': string;
}

@Component({
  selector: 'cp-dropdown',
  templateUrl: './cp-dropdown.component.html',
  styleUrls: ['./cp-dropdown.component.scss']
})
export class CPDropdownComponent implements OnInit {
  @Input() items: IItems[];
  @Input() selectedItem: any;
  @Input() isRequiredError: boolean;
  @Input() reset: Observable<boolean>;
  @Output() selected: EventEmitter<{'label': string, 'event': string}> = new EventEmitter();

  query = null;
  searchFixed = true;
  isSearching = false;
  MIN_RESULTS_FOR_SEARCH = 40;

  constructor() { }

  onClick(item) {
    if (item.heading) { return; }

    this.selectedItem = item;
    this.selected.emit(item);
  }

  onSearch(query) {
    this.query = query;
  }

  resetMenu() {
    this.selectedItem = this.items[0];
  }

  ngOnInit() {
    if (!this.reset) {
      this.reset = Observable.of(false);
    }

    this.reset.subscribe(reset => {
      if (reset) { this.resetMenu(); }
    });
  }
}
