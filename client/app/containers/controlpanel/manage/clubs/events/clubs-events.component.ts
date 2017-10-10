import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import {
  canSchoolReadResource,
  canStoreReadAndWriteResource
} from './../../../../../shared/utils/privileges';

import { ClubsService } from '../clubs.service';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base/base.component';
import { CP_PRIVILEGES_MAP } from '../../../../../shared/constants';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';

const CLUB_PENDING_STATUS = 2;

@Component({
  selector: 'cp-clubs-events',
  templateUrl: './clubs-events.component.html',
})
export class ClubsEventsComponent extends BaseComponent implements OnInit {
  club;
  loading;
  isClub = true;
  hasMembership;
  clubId: number;

  constructor(
    private store: Store<any>,
    private session: CPSession,
    private route: ActivatedRoute,
    private clubsService: ClubsService
  ) {
    super();
    this.clubId = this.route.parent.snapshot.parent.params['clubId'];
    super.isLoading().subscribe(res => this.loading = res);
  }

  private fetch() {
    let search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    super
      .fetchData(this.clubsService.getClubById(this.clubId, search))
      .then(club => {
        this.club = club.data;
        this.hasMembership = club.data.has_membership;

        this.store.dispatch({
          type: HEADER_UPDATE,
          payload: this.buildHeader(club.data.name)
        });
      });
  }

  buildHeader(name) {
    let menu = {
      heading: name,
      subheading: null,
      'crumbs': {
        'url': 'clubs',
        'label': 'Clubs'
      },
      em: null,
      children: []
    };

    let links = [];

    if (this.club.status !== CLUB_PENDING_STATUS &&
      (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.events) ||
        canStoreReadAndWriteResource(this.session.g,
          this.clubId, CP_PRIVILEGES_MAP.events))) {
      links = ['Events', ...links];
    }

    if (this.hasMembership) {
      if (this.club.status !== CLUB_PENDING_STATUS &&
        (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.moderation) ||
          canStoreReadAndWriteResource(this.session.g,
            this.clubId, CP_PRIVILEGES_MAP.moderation))) {
        links = ['Wall', ...links];
      }

      if (canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.membership) ||
        canStoreReadAndWriteResource(this.session.g,
          this.clubId, CP_PRIVILEGES_MAP.membership)) {
        links = ['Members', ...links];
      }
    }

    links = ['Info', ...links];

    links.forEach(link => {
      menu.children.push({
        label: link,
        url: `/manage/clubs/${this.clubId}/${link.toLocaleLowerCase()}`
      });
    });

    return menu;
  }

  ngOnInit() {
    this.fetch();
  }
}

