import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';
import {ParamsField} from './field.model';

@Component({
    selector: 'app-field',
    template: `
        <ui-input-container>

            <input [type]="params.type"
                   [(ngModel)]="modelValue"
                   (input)="update()"
                   #formModel="ngModel"
                   [name]="params.name"
                   uiInput
                   [required]="params.required"
                   [uiMaxlength]="params.maxLength">

            <label>{{ params.label }}</label>

            <div class="ui-messages">

                <div *ngIf="formModel.errors && formModel.dirty">

                    <div class="ui-message error"
                         [hidden]="!formModel.pristine && !formModel.errors.required">
                        {{ params.label }} é obrigatorio
                    </div>

                    <div class="ui-message error"
                         [hidden]="!formModel.pristine && !formModel.errors.uiMaxlength">
                        Deve ter menos que {{ params.maxLength }} caracteres
                    </div>

                    <div class="ui-message error counter"
                         [hidden]="!formModel.pristine && !formModel.errors.uiMaxlength">
                        {{ modelValue ? modelValue.length : 0 }} / {{ params.maxLength }}
                    </div>

                </div>

            </div>

        </ui-input-container>`,
    styles: [':host {flex: 1;}'],
    viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class FieldComponent implements OnInit {

    modelValue: string;
    defaultParams: ParamsField;
    @Input() params: ParamsField;
    @Output() changeModel = new EventEmitter<string>();

    @Input()
    get model() {
        return this.modelValue;
    }

    set model(value) {
        this.modelValue = value;
    }

    constructor() {

        this.defaultParams = {
            name: 'default',
            maxLength: 100,
            label: 'Default',
            type: 'text',
            required: false
        };

    }

    ngOnInit() {
        this.params = Object.assign(this.defaultParams, this.params);
    }

    update() {
        this.changeModel.emit(this.modelValue);
    }

}
