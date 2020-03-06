import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil, withLatestFrom } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';

import * as fromStore from '../../../store';

import { CPSession } from '@campus-cloud/session';
import { FeedsService } from '../../../feeds.service';
import { GroupType } from '../../../feeds.utils.service';
import { CPI18nService } from '@campus-cloud/shared/services';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { baseActionClass, ISnackbar } from '@campus-cloud/store/base';

interface IState {
  comments: Array<any>;
}

const state: IState = {
  comments: []
};

@Mixin([Destroyable])
@Component({
  selector: 'cp-feed-comments',
  templateUrl: './feed-comments.component.html',
  styleUrls: ['./feed-comments.component.scss']
})
export class FeedCommentsComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() feed;
  @Input() groupId: number;
  @Input() postType: number;
  @Input() groupType: GroupType;
  @Input() isCampusWallView: Observable<{}>;
  @Output() deleted: EventEmitter<null> = new EventEmitter();
  @Output() replied: EventEmitter<null> = new EventEmitter();

  loading;
  comments;
  _isCampusWallView;
  isReplyView = true;
  campusGroupId: number;
  state: IState = state;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    public feedsService: FeedsService,
    private store: Store<ISnackbar | fromStore.IWallsState>
  ) {
    super();
    this.endRange = 10000;
    this.maxPerPage = 10000;
    super.isLoading().subscribe((res) => (this.loading = res));
  }

  onReplied() {
    this.replied.emit();
    this.fetch();
  }

  onApproved(commentId: number) {
    this.state = {
      ...this.state,
      comments: this.state.comments.map((c) =>
        c.id === commentId
          ? {
              ...c,
              dislikes: c.dislikes > 1 ? c.dislikes - 1 : 0
            }
          : c
      )
    };
  }

  onDeletedComment(commentId: number) {
    const _state = Object.assign({}, this.state);

    _state.comments = _state.comments.filter((comment) => comment.id !== commentId);

    this.state = Object.assign({}, this.state, { comments: _state.comments });
    this.deleted.emit();
  }

  private fetch() {
    let search = new HttpParams().append('thread_id', this.feed.id.toString());

    search = this._isCampusWallView
      ? search.append('school_id', this.session.g.get('school').id.toString())
      : search.append('group_id', this.campusGroupId.toString());

    const campusWallComments$ = this.feedsService.getCampusWallCommentsByThreadId(
      search,
      this.feed.comment_count + 1
    );
    const groupWallComments$ = this.feedsService.getGroupWallCommentsByThreadId(
      search,
      this.feed.comment_count + 1
    );
    let stream$ = this._isCampusWallView ? campusWallComments$ : groupWallComments$;
    stream$ = stream$.pipe(withLatestFrom(this.store.pipe(select(fromStore.getComments))));

    super.fetchData(stream$).then(
      (res) => {
        const [comments, matchedComments = []] = res.data;
        const matchedCommentIds = matchedComments.map((c) => c.id);
        const getMatchedCommentById = (commentId) =>
          matchedComments.find((c) => c.id === commentId);

        this.state = Object.assign({}, this.state, {
          comments: comments.map((c) =>
            matchedCommentIds.includes(c.id) ? getMatchedCommentById(c.id) : c
          )
        });
      },
      () => this.handleError()
    );
  }

  handleError() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
  }

  ngOnInit() {
    this.endRange = this.feed.comment_count + 1;
    this.maxPerPage = this.feed.comment_count + 1;

    this.isCampusWallView.pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.campusGroupId = res.type;
      this._isCampusWallView = res.type === 1;
    });
    this.fetch();
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
