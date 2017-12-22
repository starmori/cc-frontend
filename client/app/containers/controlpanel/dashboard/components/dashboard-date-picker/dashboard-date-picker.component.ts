import {
  OnInit,
  Input,
  Output,
  ViewChild,
  Component,
  OnDestroy,
  ElementRef,
  EventEmitter,
  AfterViewInit,
  ViewEncapsulation,
} from '@angular/core';

import { CPDate } from './../../../../../shared/utils/date/date';
import { DashboardUtilsService } from './../../dashboard.utils.service';
import { FORMAT, CPDatePipe } from './../../../../../shared/pipes/date/date.pipe';

interface IDateChange {
  end: number,
  start: number,
  label: string,
}

let pickerOptions = {
  utc: true,
  inline: true,
  mode: 'range',
  altInput: true,
  maxDate: new Date(Date.now() - 24 * 3600 * 1000),
  enableTime: false,
  altFormat: 'F j, Y'
}

declare var $: any;
import 'flatpickr';

const datePipe = new CPDatePipe();

@Component({
  selector: 'cp-dashboard-date-picker',
  templateUrl: './dashboard-date-picker.component.html',
  styleUrls: ['./dashboard-date-picker.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardDatePickerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('calendarEl') calendarEl: ElementRef;
  @Output() dateChange: EventEmitter<IDateChange> = new EventEmitter();

  picker;
  selected = null;
  customDates = [];
  dateFormat = FORMAT.SHORT;

  @Input()
  set state(state) {
    this.setLabel(state);
  }

  constructor(
    private helper: DashboardUtilsService
  ) { }

  onDateChanged(selectedDates) {
    if (selectedDates.length === 2) {
      const formattedStart = datePipe.transform(CPDate.toEpoch(selectedDates[0]), this.dateFormat);
      const formattedEnd = datePipe.transform(CPDate.toEpoch(selectedDates[1]), this.dateFormat);

      const date = {
        start: this.helper.dayStart(selectedDates[0]),
        end: this.helper.dayEnd(selectedDates[1]),
        label: `${formattedStart} - ${formattedEnd}`
      };

      this.setLabel(date);

      this.triggerChange();

      $(this.calendarEl.nativeElement).dropdown('toggle');
    }
  }

  resetCalendar() {
    this.picker.clear();
  }

  ngAfterViewInit() {
    const host = this.calendarEl.nativeElement;
    pickerOptions = Object.assign(
      {},
      pickerOptions,
      { onChange: this.onDateChanged.bind(this) }
    );

    this.picker = $(host).flatpickr(pickerOptions);
  }

  handleCustomDate(date) {
    this.setLabel(date);
    this.triggerChange();
    this.resetCalendar();
  }

  triggerChange() {
    this.dateChange.emit(this.selected);
  }

  setLabel(date) {
    this.selected = date;
  }

  ngOnDestroy() {
    this.picker.destroy();
  }

  ngOnInit() {
    this.customDates = [
      this.helper.last30Days(),
      this.helper.last90Days(),
      this.helper.lastYear()
    ];
  }
}