import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ResourcesUtilsService } from './../../resources.utils.service';
import { CPI18nService } from '../../../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-personas-resource-form',
  templateUrl: './resource-form.component.html',
  styleUrls: ['./resource-form.component.scss']
})
export class PersonasResourceFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() hideTypeSelector = false;

  @Output() formChange: EventEmitter<FormGroup> = new EventEmitter();

  contentTypes;
  selectedItem = null;

  state = {
    resource: false,
    resourceList: false
  };

  constructor(public cpI18n: CPI18nService, public utils: ResourcesUtilsService) {}

  updateFormMetaValues(data) {
    for (const key in data.meta) {
      this.form.controls[key].setValue(data.meta[key]);
    }
  }

  onContentTypeChange(selected) {
    this.form.controls['link_url'].setValue(null);
    this.form.controls['link_params'].setValue({});

    this.state = {
      ...this.state,
      resource: selected.extra_field_type === 2,
      resourceList: selected.extra_field_type === 3
    };
  }

  onLinkUrlChange(url) {
    this.form.controls['link_url'].setValue(url);
  }

  onResourceTypeSelected(resourceType) {
    this.form.controls['link_url'].setValue(null);
    this.form.controls['link_params'].setValue({});

    this.updateFormMetaValues(resourceType);
  }

  updateState() {
    this.state = {
      ...this.state,
      resource: !this.utils.isListOfLists(this.form.value),
      resourceList: this.utils.isListOfLists(this.form.value)
    };

    const selectedType = this.state.resource ? 'resource' : 'resource_list';

    this.selectedItem = this.contentTypes.filter((i) => i.id === selectedType)[0];
  }

  ngOnInit(): void {
    console.log(this.form.value);
    this.form.valueChanges.subscribe(() => {
      this.formChange.emit(this.form);
    });

    if (this.hideTypeSelector) {
      this.state = {
        ...this.state,
        resource: true,
        resourceList: false
      };
    }

    this.contentTypes = require('./content-types.json').map((content) => {
      return {
        ...content,
        label: this.cpI18n.translate(content.label)
      };
    });

    if (this.form.value.name) {
      this.updateState();
    }
  }
}
