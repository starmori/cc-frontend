import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cpFilterPipe' })
export class CPFilterPipe implements PipeTransform {
  transform(data: any[], { query, filterBy }) {
    if (!query) { return data; };

    const filterResults = [];

    if (Array.isArray(filterBy)) {
      data.forEach(item => {
        filterBy.map(filter => {
          if (item[filter].toLowerCase().includes(query.toLowerCase())) {
            filterResults.push(item);
          }
        });
      }
      );

      if (!filterResults.length) {
        filterResults.push({ noResults: true });
      }

    } else {
      data.forEach(item => {
        let str: String = (item[filterBy]).toString().toLowerCase();

        if (str.includes(query.toLowerCase())) {
          filterResults.push(item);
        }
      });

      if (!filterResults.length) {
        filterResults.push({ [filterBy]: 'No Results' });
      }
    }

    return filterResults;
  }
}