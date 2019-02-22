import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';
import {ParamsAutocomplete, ParamsRequest} from './select.model';
import {ApiService} from '../../../../core/api/api.service';
import {Select} from '../../../../core/select/select';

@Component({
  selector: 'app-select',
  template: `
    <ui-input-container>
      <select
        [id]="params.name"
        [name]="params.name"
        #field="ngModel"
        [(ngModel)]="modelValue"
        uiInput
        (change)="update()"
        [required]="params.required">
        <option *ngFor="let item of select.records" [value]="item[params.modelProperty]">
          {{ item[params.primary] }}
        </option>
      </select>
      <label [for]="params.name">{{ params.label }}</label>
      <div class="ui-messages">
        <div
          *ngIf="field.errors && field.dirty">
          <div class="ui-message error"
               [hidden]="!field.pristine && !field.errors.required">
            Esse campo é obrigatorio
          </div>
        </div>
      </div>
    </ui-input-container>
  `,
  styles: [':host {flex: 1;}'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class SelectComponent implements OnInit {

  select: Select;
  modelValue: string | number;
  defaultParams: ParamsAutocomplete;

  @Input() params: ParamsAutocomplete;
  @Input() paramsRequest: ParamsRequest;

  @Output() changeModel = new EventEmitter<any>();
  @Output() selectChange = new EventEmitter<any>();

  @Input()
  get model() {
    return this.modelValue;
  }

  set model(value) {
    this.modelValue = value;
  }

  constructor(private api: ApiService) {

    this.defaultParams = {
      name: 'default',
      label: 'Default',
      primary: 'nome',
      modelProperty: 'id',
      required: false
    };

    this.select = new Select(null, null);

  }

  ngOnInit() {
    this.params = Object.assign(this.defaultParams, this.params);
    this.select = new Select(this.api, this.paramsRequest);
  }

  update() {
    this.changeModel.emit(this.modelValue);
  }

}
