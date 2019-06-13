import { get as _get, sortBy } from 'lodash';
import { Injectable } from '@angular/core';

import { CPI18nService } from '@shared/services';
import { CampusLink } from '@controlpanel/manage/links/tile';
import { TilesUtilsService } from '@controlpanel/customise/personas/tiles/tiles.utils.service';

export interface IStudioContentResource {
  id: string;
  login_required?: boolean;
  link_type?: number;
  label: string;
  meta?: {
    link_params: any;
    link_url?: string;
    open_in_browser?: number;
  };
}

@Injectable()
export class ContentUtilsProviders {
  constructor(private cpI18n: CPI18nService) {}

  static readonly contentTypes = {
    web: 'webLink',
    list: 'resource',
    single: 'singleItem',
    thirdParty: 'thirdPartyApp',
    resourceList: 'resourceList'
  };

  static isWebAppContent(resource: IStudioContentResource) {
    const linkUrl = _get(resource, ['meta', 'link_url'], false);

    if (!linkUrl) {
      return false;
    }

    return TilesUtilsService.webAppSupportedLinkUrls.includes(linkUrl);
  }

  static isLoginRequired(resource: IStudioContentResource) {
    const linkUrl = _get(resource, ['meta', 'link_url'], false);

    if (!linkUrl) {
      return false;
    }

    return TilesUtilsService.loginRequiredTiles.includes(linkUrl);
  }

  static getContentTypeByCampusLink(campusLink) {
    let resource;
    const resources = ContentUtilsProviders.resourceTypes();

    /**
     * loop through keys filter by the ones with linkUrl values
     * and return the one matching the linkUrl from `campusLink`
     */
    resource = Object.keys(resources).find((resourceKey) =>
      resources[resourceKey]
        .filter(
          (resourcesByResourceType: IStudioContentResource) => resourcesByResourceType.meta.link_url
        )
        .some(
          (resourcesWithMetaURL: IStudioContentResource) =>
            resourcesWithMetaURL.meta.link_url === campusLink.link_url
        )
    );
    if (!resource) {
      /**
       * if not found above its either Web or Custom list, since those get filter out
       */
      const { link_url } = campusLink;
      return link_url === CampusLink.campusLinkList
        ? ContentUtilsProviders.contentTypes.resourceList
        : ContentUtilsProviders.contentTypes.web;
    }
    return resource;
  }

  static resourceTypes(): { [key: string]: Array<IStudioContentResource> } {
    return {
      [ContentUtilsProviders.contentTypes.single]: [
        {
          id: 'subscribable_calendar',
          label: 't_personas_tile_create_resource_type_subscribable_calendar',
          meta: {
            link_params: {},
            link_url: CampusLink.subscribableCalendar
          }
        },
        {
          id: 'campus_service',
          label: 't_personas_tile_create_resource_type_campus_service',
          meta: {
            link_params: {},
            link_url: CampusLink.campusService
          }
        },
        {
          id: 'store',
          label: 't_personas_tile_create_resource_type_store',
          meta: {
            link_params: {},
            link_url: CampusLink.store
          }
        }
      ],
      [ContentUtilsProviders.contentTypes.list]: [
        {
          id: 'academic_calendar',
          label: 't_personas_tile_create_resource_type_academic_calendar',
          meta: {
            link_params: {},
            link_url: CampusLink.academicCalendarList
          }
        },
        {
          id: 'groups_and_clubs',
          label: 't_personas_tile_create_store_list_groups_and_clubs',
          meta: {
            link_params: {
              category_ids: [-1]
            },
            link_url: CampusLink.storeList
          }
        },
        {
          id: 'athletics_club',
          label: 't_personas_tile_create_resource_type_athletics_club',
          meta: {
            link_params: {
              category_ids: [16]
            },
            link_url: CampusLink.storeList
          }
        },
        {
          id: 'courses',
          label: 't_personas_tile_create_resource_type_courses',
          meta: {
            link_params: {},
            link_url: CampusLink.courseSearch
          }
        },
        {
          id: 'deal_store_list',
          label: 't_personas_tile_create_resource_type_deal_store_list',
          meta: {
            link_params: {},
            link_url: CampusLink.dealStoreList
          }
        },
        {
          id: 'timetable',
          label: 't_personas_tile_create_resource_type_timetable',
          meta: {
            link_params: {},
            link_url: CampusLink.timetable
          }
        },
        {
          id: 'dining',
          label: 'dining',
          meta: {
            link_params: {},
            link_url: CampusLink.dining
          }
        },
        {
          id: 'event_list',
          label: 't_personas_tile_create_resource_type_event_list',
          meta: {
            link_params: {},
            link_url: CampusLink.eventList
          }
        },
        {
          id: 'job_list',
          label: 't_personas_tile_create_resource_type_job_list',
          meta: {
            link_params: {},
            link_url: CampusLink.jobList
          }
        },
        {
          id: 'default_campus_link_list',
          label: 't_personas_tile_create_resource_type_default_campus_link_list',
          meta: {
            link_params: {},
            link_url: CampusLink.defaultCampusLinkList
          }
        },
        {
          id: 'campus_poi_list',
          label: 't_personas_tile_create_resource_type_campus_poi_list',
          meta: {
            link_params: {},
            link_url: CampusLink.campusPoiList
          }
        },
        {
          id: 'user_orientation_calendar_list',
          label: 't_personas_tile_create_resource_type_user_orientation_calendar_list',
          meta: {
            link_params: {},
            link_url: CampusLink.userOrientationCalendarList
          }
        },
        {
          id: 'orientation_calendar_list',
          label: 't_personas_tile_create_resource_type_orientation_calendar_list',
          meta: {
            link_params: {},
            link_url: CampusLink.orientationCalendarList
          }
        },
        {
          id: 'service_by_category_id',
          label: 't_personas_tile_create_resource_type_service_by_category_id',
          meta: {
            link_params: {},
            link_url: CampusLink.campusServiceList
          }
        }
      ],
      [ContentUtilsProviders.contentTypes.web]: [
        {
          id: 'web_link',
          label: 't_personas_tile_create_type_resource_web_link',
          meta: {
            link_params: {},
            open_in_browser: 0
          }
        },
        {
          id: 'external_link',
          label: 't_personas_tile_create_type_resource_external_link',
          meta: {
            link_params: {},
            open_in_browser: 1
          }
        }
      ],
      [ContentUtilsProviders.contentTypes.thirdParty]: [
        {
          id: 'external_app_open',
          link_type: 4,
          label: 't_personas_tile_create_resource_type_external_app_open',
          meta: {
            link_params: {},
            link_url: CampusLink.appOpen
          }
        }
      ],
      [ContentUtilsProviders.contentTypes.resourceList]: []
    };
  }

  static getResourcesForType(
    resourceType: string,
    filters: Function[] = []
  ): Array<IStudioContentResource> {
    const resources: Array<IStudioContentResource> = ContentUtilsProviders.resourceTypes()[
      resourceType
    ];

    if (!filters.length) {
      return resources;
    }

    return resources.filter((resource) => filters.every((filterByFn) => filterByFn(resource)));
  }

  resourcesToIItem(resources: IStudioContentResource[]): Array<IStudioContentResource> {
    if (!resources) {
      return [{ label: '---', id: null, meta: null }];
    }

    return [
      { label: '---', id: null, meta: null },
      ...sortBy(
        resources.map((r: IStudioContentResource) => {
          return {
            ...r,
            label: this.cpI18n.translate(r.label)
          };
        }),
        (r: any) => r.label
      )
    ];
  }
}