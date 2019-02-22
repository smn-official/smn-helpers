import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';

@Component({
    selector: 'app-cpf',
    template: `
        <ui-input-container>
            <input type="text"
                   [(ngModel)]="modelValue"
                   (input)="update()"
                   #fieldCpf="ngModel"
                   name="cpf"
                   uiInput
                   [uiMaskCpf]="true"
                   required>
            <label>CPF</label>
            <div class="ui-messages">

                <div *ngIf="fieldCpf.errors && fieldCpf.dirty">
                    <div class="ui-message error"
                         [hidden]="!fieldCpf.pristine && !fieldCpf.errors.required">
                        Digite um CPF
                    </div>

                    <div class="ui-message error"
                         [hidden]="!fieldCpf.pristine && !fieldCpf.errors.parse">
                        Digite um CPF válido
                    </div>

                </div>
            </div>
        </ui-input-container>
    `,
    styles: [`:host {
        flex: 1;
    }`],
    viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class CpfComponent {

    modelValue: string;

    @Input()
    get model() {
        return this.modelValue;
    }

    set model(value) {
        this.modelValue = value;
    }

    @Output() changeModel = new EventEmitter<string>();

    update() {
        this.changeModel.emit(this.modelValue);
    }

}
