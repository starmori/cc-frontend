import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';
import {
  Input,
  OnInit,
  Output,
  Component,
  OnDestroy,
  ViewChild,
  EventEmitter
} from '@angular/core';

import * as fromStore from '../../../store';

import { validThread } from '../../../validators';
import { FeedsService } from '../../../feeds.service';
import { CPSession, ISchool } from '@campus-cloud/session';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { ISnackbar, baseActions } from '@campus-cloud/store/base';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { FeedsUtilsService, GroupType } from '../../../feeds.utils.service';
import { TextEditorDirective } from '@projects/campus-cloud/src/app/shared/directives';
import { FeedsAmplitudeService } from '@controlpanel/manage/feeds/feeds.amplitude.service';
import {
  ImageService,
  StoreService,
  CPI18nService,
  CPTrackingService
} from '@campus-cloud/shared/services';

@Mixin([Destroyable])
@Component({
  selector: 'cp-feed-input-box',
  templateUrl: './feed-input-box.component.html',
  styleUrls: ['./feed-input-box.component.scss']
})
export class FeedInputBoxComponent implements OnInit, OnDestroy {
  @ViewChild(TextEditorDirective, { static: true }) private editor: TextEditorDirective;

  @Input() groupId: number;
  @Input() threadId: number;
  @Input() postType: number;
  @Input() replyView: boolean;
  @Input() groupType: GroupType;
  @Input() wallCategory: string;
  @Input() isCampusWallView: Observable<any>;
  @Output() created: EventEmitter<null> = new EventEmitter();

  stores$;
  channels$;
  hostType;
  imageError;
  buttonData;
  campusGroupId;
  form: FormGroup;
  school: ISchool;
  _isCampusWallView;
  DISABLED_MEMBER_TYPE = 100;
  image$: BehaviorSubject<string> = new BehaviorSubject(null);
  reset$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  resetTextEditor$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    public cpI18n: CPI18nService,
    public utils: FeedsUtilsService,
    private imageService: ImageService,
    private feedsService: FeedsService,
    private storeService: StoreService,
    public cpTracking: CPTrackingService,
    public feedsAmplitudeService: FeedsAmplitudeService,
    public store: Store<ISnackbar | fromStore.IWallsState>
  ) {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.stores$ = this.storeService.getStores(search);

    this.channels$ = this.feedsService.getChannelsBySchoolId(1, 100, search).pipe(
      startWith([{ label: '---' }]),
      map((channels: any[]) => {
        const _channels = [
          {
            label: '---',
            action: null
          }
        ];

        channels.forEach((channel: any) => {
          const _channel = {
            label: channel.name,
            action: channel.id
          };

          _channels.push(_channel);
        });

        return _channels;
      })
    );
  }

  replyToThread({ message, message_image_url_list, school_id, store_id }): Promise<any> {
    let body = {
      school_id,
      store_id,
      comment: message,
      thread_id: this.threadId
    };

    if (message_image_url_list) {
      body = Object.assign({}, body, {
        comment_image_url_list: [...message_image_url_list]
      });
    }

    if (this.groupType === GroupType.orientation) {
      body = this.asCalendarFormat(body);
    }

    const groupWall$ = this.feedsService.replyToGroupThread(body);
    const campusWall$ = this.feedsService.replyToCampusThread(body);
    const stream$ = this._isCampusWallView ? groupWall$ : campusWall$;

    return stream$.toPromise();
  }

  postToWall(formData): Promise<any> {
    if (this.groupType === GroupType.orientation) {
      formData = this.asCalendarFormat(formData);
    }

    const groupWall$ = this.feedsService.postToGroupWall(formData);
    const campusWall$ = this.feedsService.postToCampusWall(formData);
    const stream$ = this._isCampusWallView ? groupWall$ : campusWall$;

    return stream$.toPromise();
  }

  asCalendarFormat(data) {
    delete data['store_id'];

    return { ...data, calendar_id: this.groupId };
  }

  handleError({ status = 400 }) {
    const forbidden = this.cpI18n.translate('feeds_error_wall_is_disabled');
    const somethingWentWrong = this.cpI18n.translate('something_went_wrong');

    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        body: status === 403 ? forbidden : somethingWentWrong,
        class: 'danger',
        sticky: true,
        autoClose: true
      }
    });
  }

  onSubmit(data) {
    const submit = this.replyView
      ? this.replyToThread(this.parseData(data))
      : this.postToWall(this.parseData(data));

    submit
      .then((res) => {
        this.trackAmplitudeEvents(res);
        this.buttonData = { ...this.buttonData, disabled: false };
        if (this.replyView) {
          this.store.dispatch(fromStore.addComment({ comment: res }));
        } else {
          this.store.dispatch(fromStore.addThread({ thread: res }));
        }
        this.resetFormValues();
        this.created.emit(res);
      })
      .catch((err) => {
        this.buttonData = { ...this.buttonData, disabled: false };

        this.handleError(err);
      });
  }

  parseData(data) {
    const _data = {
      post_type: data.post_type || null,
      store_id: data.store_id,
      school_id: this.session.g.get('school').id,
      message: data.message,
      message_image_url_list: data.message_image_url_list
    };

    if (this._isCampusWallView) {
      _data['group_id'] = this.campusGroupId;
    }

    return _data;
  }

  resetFormValues() {
    if (!this.groupId && !this._isCampusWallView && !this.replyView) {
      this.form.controls['group_id'].setValue(null);
      this.form.controls['post_type'].setValue(null);
    }
    this.editor.clear();
    this.reset$.next(true);
    this.resetTextEditor$.next(true);
    this.form.controls['message'].setValue('');
    this.form.controls['message_image_url_list'].setValue([]);
  }

  onDeleteImage() {
    this.form.get('message_image_url_list').setValue([]);
  }

  onSelectedHost(host): void {
    this.hostType = host.hostType;
    this.form.controls['store_id'].setValue(host.value);
  }

  onSelectedChannel(channel): void {
    this.form.controls['post_type'].setValue(channel.action);
  }

  onFileUpload(file) {
    this.imageError = null;
    this.imageService.upload(file).subscribe(
      ({ image_url }: any) => {
        this.image$.next(image_url);
        this.form.controls['message_image_url_list'].setValue([image_url]);
        this.trackUploadImageEvent();
      },
      (err) => {
        this.imageError = err.message || this.cpI18n.translate('something_went_wrong');
      }
    );
  }

  trackUploadImageEvent() {
    const properties = this.cpTracking.getAmplitudeMenuProperties();

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.UPLOADED_PHOTO, properties);
  }

  trackAmplitudeEvents(data) {
    let eventName;
    let eventProperties;

    eventName = amplitudeEvents.WALL_SUBMITTED_POST;

    eventProperties = {
      ...this.feedsAmplitudeService.getWallAmplitudeProperties(),
      post_id: data.id,
      host_type: this.hostType,
      upload_image: FeedsAmplitudeService.hasImage(data.has_image)
    };

    if (this.replyView) {
      eventName = amplitudeEvents.WALL_SUBMITTED_COMMENT;

      eventProperties = {
        ...eventProperties,
        comment_id: data.id
      };

      delete eventProperties['post_id'];
      delete eventProperties['post_type'];
    }

    this.cpTracking.amplitudeEmitEvent(eventName, eventProperties);
  }

  setDefaultHostWallCategory(isCampusWallView) {
    const host_type = this.session.defaultHost ? this.session.defaultHost.hostType : null;
    this.hostType = isCampusWallView ? null : host_type;
  }

  ngOnInit() {
    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('walls_button_create_post')
    };

    const defaultHost = this.session.defaultHost ? this.session.defaultHost.value : null;

    this.school = this.session.g.get('school');

    this.form = this.fb.group(
      {
        group_id: [null],
        school_id: [this.session.g.get('school').id],
        store_id: [defaultHost, Validators.required],
        post_type: [this.replyView ? this.postType : null, Validators.required],
        message: ['', [Validators.maxLength(500)]],
        message_image_url_list: [[]]
      },
      { validators: validThread }
    );

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // console.log(this.form.value);
      this.buttonData = { ...this.buttonData, disabled: !this.form.valid };
    });

    this.isCampusWallView.pipe(takeUntil(this.destroy$)).subscribe((res) => {
      // console.log('isCampusWallView', res);
      // Not Campus Wall
      if (res.type !== 1) {
        this.campusGroupId = res.type;
        this.form.controls['store_id'].setValue(res.group_id);
        this.form.removeControl('post_type');
        this._isCampusWallView = true;
        this.setDefaultHostWallCategory(this._isCampusWallView);

        return;
      }

      if (this.form) {
        this.form.registerControl('post_type', new FormControl(null, Validators.required));
        this.form.controls['store_id'].setValue(defaultHost);
      }

      this._isCampusWallView = false;
      this.setDefaultHostWallCategory(this._isCampusWallView);
    });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
