import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { isDev } from '../../../../../config/env';
import { STATUS } from '../../../../../shared/constants';
import { FileUploadService } from '../../../../../shared/services';

declare var $: any;

@Component({
  selector: 'cp-lists-import',
  templateUrl: './lists-import.component.html',
  styleUrls: ['./lists-import.component.scss']
})
export class ListsImportComponent implements OnInit {
  @Output() launchCreateModal: EventEmitter<any> = new EventEmitter();

  users;
  options;
  fileName;

  constructor(private fileService: FileUploadService) { }

  parser(file) {
    const url = !isDev ?
      '/announcements/import' :
      'http://localhost:8000/announcements/import';
    return this
      .fileService
      .uploadFile(file, url)
      .toPromise()
      .then(
      res => {
        this.users = res;
        return Promise.resolve();
      }
      )
      .catch(
      err => {
        let serverError = err.json().error;
        return Promise.reject(serverError ? serverError : STATUS.SOMETHING_WENT_WRONG);
      }
      );
  }

  onNavigate() {
    $('#listsImport').modal('hide');
    this.launchCreateModal.emit(this.users);
  }

  ngOnInit() {
    this.fileName = 'mass_user_upload.csv';

    let templateUrl = isDev ? `/templates/${this.fileName}` : `/dist/templates/${this.fileName}`;

    this.options = {
      templateUrl,
      validExtensions: ['csv'],
      parser: this.parser.bind(this)
    };
  }
}