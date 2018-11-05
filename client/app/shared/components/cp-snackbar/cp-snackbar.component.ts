import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { baseActions, ISnackbar, getSnackbarState } from './../../../store/base';

@Component({
  selector: 'cp-snackbar',
  templateUrl: './cp-snackbar.component.html',
  styleUrls: ['./cp-snackbar.component.scss']
})
export class CPSnackBarComponent implements OnDestroy, OnInit {
  snack;

  constructor(private store: Store<ISnackbar>) {
    this.store.select(getSnackbarState).subscribe((res: any) => {
      this.snack = res;

      if (this.snack.autoClose) {
        setTimeout(
          () => {
            this.doClose();
          },

          this.snack.autoCloseDelay
        );
      }
    });
  }

  doClose() {
    this.store.dispatch({ type: baseActions.SNACKBAR_HIDE });
  }

  ngOnDestroy() {
    this.doClose();
  }

  ngOnInit() {}
}
