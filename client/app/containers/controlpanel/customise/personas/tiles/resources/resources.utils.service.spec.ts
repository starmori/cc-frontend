import { ResourcesUtilsService } from './resources.utils.service';
import { mockPersonas } from '../../__mock__/personas.mock';
import { PersonasType } from '../../personas.status';
import { mockResource } from './__mock__';

describe('ResourcesUtilsService', () => {
  let service: ResourcesUtilsService;

  beforeEach(() => {
    service = new ResourcesUtilsService();
  });

  it('should find correct types for mobile persona', () => {
    const nullType = service.getType({ ...mockPersonas[0] }, { ...mockResource });
    expect(nullType).toBe(null);

    const calendarType = service.getType(
      { ...mockPersonas[0] },
      {
        ...mockResource,
        link_url: 'oohlala://academic_calendar_list'
      }
    );
    expect(calendarType).toBe('academic_calendar');

    const externalType = service.getType(
      { ...mockPersonas[0] },
      {
        ...mockResource,
        link_url: 'customurl',
        open_in_browser: true
      }
    );
    expect(externalType).toBe('external_link');

    const inappType = service.getType(
      { ...mockPersonas[0] },
      {
        ...mockResource,
        link_url: 'customurl',
        open_in_browser: false
      }
    );
    expect(inappType).toBe('web_link');

    const listType = service.getType(
      { ...mockPersonas[0] },
      {
        ...mockResource,
        link_url: 'oohlala://campus_link_list'
      }
    );
    expect(listType).toBe(null);
  });

  it('should find correct types for webapp persona', () => {
    const courseType = service.getType(
      {
        ...mockPersonas[0],
        platform: PersonasType.web
      },
      {
        ...mockResource,
        link_url: 'oohlala://course_search'
      }
    );
    expect(courseType).toBe(null);

    const serviceType = service.getType(
      {
        ...mockPersonas[0],
        platform: PersonasType.web
      },
      {
        ...mockResource,
        link_url: 'oohlala://campus_service'
      }
    );
    expect(serviceType).toBe('campus_service');

    const listType = service.getType(
      {
        ...mockPersonas[0],
        platform: PersonasType.web
      },
      {
        ...mockResource,
        link_url: 'oohlala://campus_link_list'
      }
    );
    expect(listType).toBe(null);
  });
});