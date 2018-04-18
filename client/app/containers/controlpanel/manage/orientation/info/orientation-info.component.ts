import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OrientationService } from '../orientation.services';
import { BaseComponent } from '../../../../../base';
import { URLSearchParams } from '@angular/http';
import { CPSession } from './../../../../../session';

@Component({
  selector: 'cp-orientation-info',
  templateUrl: './orientation-info.component.html',
  styleUrls: ['./orientation-info.component.scss']
})
export class OrientationInfoComponent extends BaseComponent implements OnInit {
  loading;
  selectedProgram;
  orientationId: number;
  launchEditModal = false;

  constructor(
    public session: CPSession,
    private route: ActivatedRoute,
    public service: OrientationService
  ) {
    super();
    this.orientationId = this.route.parent.snapshot.params['orientationId'];

    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  public fetch() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    super
      .fetchData(this.service.getProgramById(this.orientationId, search))
      .then((res) => (this.selectedProgram = res.data));
  }

  onLaunchEditModal() {
    this.launchEditModal = true;
    setTimeout(
      () => {
        $('#programEdit').modal();
      },

      1
    );
  }

  onEditedLink(editedProgram: any) {
    this.launchEditModal = false;
    this.selectedProgram = editedProgram;
  }

  ngOnInit() {
    this.fetch();
  }
}