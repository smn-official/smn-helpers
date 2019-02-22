import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';
import {ParamsAutocomplete, ParamsRequest} from './autocomplete.model';
import { Autocomplete } from '../../../../core/autocomplete/autocomplete';
import { ApiService } from '../../../../core/api/api.service';

@Component({
    selector: 'app-autocomplete',
    template: `
        <ui-input-container>

            <input
                type="text"
                #field="ngModel"
                uiInput
                uiAutocomplete
                autocomplete="off"
                [id]="params.name"
                [name]="params.name"
                [primary]="params.primary"
                [(modelValue)]="modelPropertyValue"
                [(ngModel)]="modelValue"
                [model-property]="params.modelProperty"
                (selectChange)="change($event)"
                [list]="autocomplete.records"
                [loading]="autocomplete.loading"
                (input)="autocomplete.search(getFullParams()); update()"
                (focus)="autocomplete.search(getFullParams())"
                (loadMore)="autocomplete.loadMore(getFullParams())">

            <label [for]="params.name">{{ params.label }}</label>
        </ui-input-container>
    `,
    styles: [':host {flex: 1;}'],
    viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class AutocompleteComponent implements OnInit, OnChanges {

    autocomplete: Autocomplete;
    modelValue: string | number;
    modelPropertyValue: string | number;
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

    @Input()
    get modelProperty() {
        return this.modelPropertyValue;
    }

    set modelProperty(value) {
        this.modelPropertyValue = value;
    }

    @Input() extraParams;

    getFullParams() {
        return {
            _join: true,
            filtro: this.modelValue,
            ...this.extraParams
        };
    }

    constructor(private api: ApiService) {

        this.defaultParams = {
            name: 'default',
            label: 'Default',
            primary: 'nome',
            modelProperty: 'id',
            required: false
        };

    }

    ngOnInit() {
        this.params = Object.assign(this.defaultParams, this.params);
        this.extraParams = this.extraParams || {};
        this.autocomplete = new Autocomplete(this.api, this.paramsRequest);
    }

    ngOnChanges(changes) {
        if (changes.extraParams) {
            this.extraParams = changes.extraParams.currentValue || {};
        }
    }

    update() {
        this.changeModel.emit({model: this.modelValue, modelProperty: this.modelPropertyValue});
    }

    change(event) {
        this.selectChange.emit(event);
        setTimeout(() => this.update()); // setTimeout foi utilizado para aguardar a atualização da model
    }

}
