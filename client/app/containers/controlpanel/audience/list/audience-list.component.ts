import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { CPSession } from '../../../../session';
import { AudienceType } from './../audience.status';
import { AudienceService } from '../audience.service';
import { BaseComponent } from '../../../../base/base.component';
import { CPI18nService } from '../../../../shared/services/index';
import { createSpreadSheet } from './../../../../shared/utils/csv/parser';
import { ISnackbar, SNACKBAR_SHOW } from '../../../../reducers/snackbar.reducer';

interface IState {
  audiences: Array<any>;
  search_str: string;
  sort_field: string;
  list_type: number;
  sort_direction: string;
}

const state: IState = {
  audiences: [],
  search_str: null,
  sort_field: 'name',
  list_type: null,
  sort_direction: 'asc'
};

@Component({
  selector: 'cp-audience-list',
  templateUrl: './audience-list.component.html',
  styleUrls: ['./audience-list.component.scss']
})
export class AudienceListComponent extends BaseComponent implements OnInit {
  loading;
  audienceUsers;
  isAudienceEdit;
  isAudienceDelete;
  isAudienceImport;
  isAudienceCreate;
  state: IState = state;
  custom = AudienceType.custom;

  constructor(
    private session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<ISnackbar>,
    private service: AudienceService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));

    this.fetch();
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };

    this.fetch();
  }

  onImportError(err) {
    let message = this.cpI18n.translate('something_went_wrong');

    const error = JSON.parse(err._body).error;
    if (error === 'Database Error') {
      message = this.cpI18n.translate('audience_create_error_duplicate_audience');
    }

    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        sticky: true,
        class: 'danger',
        body: message
      }
    });
  }

  onImportSuccess(newAudiences) {
    this.state = { ...this.state, audiences: [newAudiences, ...this.state.audiences] };

    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        sticky: true,
        class: 'success',
        body: this.cpI18n.translate('audience_import_success_message')
      }
    });
  }

  onFilterByListType(list_type) {
    this.state = { ...this.state, list_type };

    this.fetch();
  }

  downloadAudience({ id }) {
    const columns = [
      this.cpI18n.translate('first_name'),
      this.cpI18n.translate('last_name'),
      this.cpI18n.translate('email')
    ];
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    this.service
      .getAudienceById(id, search)
      .toPromise()
      .then(({ users, name }) => {
        const data = users.map((user) => {
          return {
            [this.cpI18n.translate('first_name')]: user.firstname,
            [this.cpI18n.translate('last_name')]: user.lastname,
            [this.cpI18n.translate('email')]: user.email
          };
        });
        createSpreadSheet(data, columns, `${name}`);
      })
      .catch(() =>
        this.store.dispatch({
          type: SNACKBAR_SHOW,
          payload: {
            sticky: true,
            class: 'danger',
            body: this.cpI18n.translate('something_went_wrong')
          }
        })
      );
  }

  private fetch() {
    const search = new URLSearchParams();
    search.append('search_str', this.state.search_str);
    search.append('sort_field', this.state.sort_field);
    search.append('sort_direction', this.state.sort_direction);
    if (this.state.list_type !== null) {
      search.append('list_type', this.state.list_type.toString());
    }
    search.append('school_id', this.session.g.get('school').id.toString());

    const stream$ = this.service.getAudiences(search, this.startRange, this.endRange);

    super
      .fetchData(stream$)
      .then((res) => (this.state = Object.assign({}, this.state, { audiences: res.data })));
  }

  onSearch(search_str) {
    this.state = Object.assign({}, this.state, { search_str });
    this.resetPagination();

    this.fetch();
  }

  onPaginationNext() {
    super.goToNext();
    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();
    this.fetch();
  }

  onResetCreateAudience() {
    this.audienceUsers = [];
    this.isAudienceCreate = false;
  }

  onCreatedAudience() {
    this.fetch();
  }

  onLaunchCreateModal(users?: Array<any>) {
    this.isAudienceCreate = true;
    this.audienceUsers = users ? users : null;
    setTimeout(
      () => {
        $('#audienceCreate').modal();
      },

      1
    );
  }

  onLaunchImportModal() {
    this.isAudienceImport = true;
    setTimeout(
      () => {
        $('#audienceImport').modal();
      },

      1
    );
  }

  onEditedAudience() {
    this.fetch();
  }

  onDeletedAudience(audienceId: number) {
    this.isAudienceDelete = false;
    const _state = Object.assign({}, this.state);

    _state.audiences = _state.audiences.filter((audience) => {
      if (audience.id !== audienceId) {
        return audience;
      }

      return;
    });

    this.state = Object.assign({}, this.state, { audiences: _state.audiences });

    if (this.state.audiences.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
  }

  ngOnInit() {}
}