import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlContainer, NgForm} from '@angular/forms';
import {ParamsCep} from './cep.model';
import {Subject} from 'rxjs/Subject';
import {ApiService} from '../../../../core/api/api.service';

@Component({
  selector: 'app-cep',
  template: `
    <ui-input-container>
      <input [id]="params.name"
             [name]="params.name"
             #field="ngModel"
             type="text"
             uiMaskCep
             autocomplete="no"
             [(ngModel)]="cep"
             (input)="update()"
             [required]="params.required"
             uiInput
             (keyup.enter)="(field.valid && !loading) && setAddress(cep)">

      <label for="cep">{{ params.label }}</label>

      <div class="icon">
        <button class="ui-button flat icon pointer"
                uiRipple
                (click)="(field.valid && !loading) && setAddress(cep)">
          <ui-progress-radial class="indeterminate"
                              *ngIf="loading"></ui-progress-radial>
          <i class="material-icons">search</i>
        </button>
      </div>

      <div class="ui-messages">

        <div *ngIf="field.errors && field.dirty">

          <div class="ui-message error"
               [hidden]="!field.pristine && !field.errors.required">
            Digite o CEP
          </div>

          <div class="ui-message error"
               [hidden]="!field.pristine && !field.errors.parse">
            Digite um CEP valído
          </div>

        </div>

      </div>

    </ui-input-container>
  `,
  styles: [':host {flex: 1;}'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class CepComponent implements OnInit {

  cep: string;
  loading: boolean;
  defaultParams: ParamsCep;

  @Input() get model() {
    return this.cep;
  }

  set model(value) {
    this.cep = value;
  }

  @Input() params: ParamsCep;
  @Output() changeModel = new EventEmitter<string>();
  @Output() foundAddress = new EventEmitter<any>();

  constructor(private api: ApiService) {

    this.defaultParams = {
      name: 'default',
      label: 'CEP',
      required: false
    };

  }

  ngOnInit() {
    this.params = Object.assign(this.defaultParams, this.params);
  }

  update() {
    this.changeModel.emit(this.cep);
  }

  search(cep) {
    const subject = new Subject();
    this.api
      .http('GET', `https://cep.smn.com.br/public/cep/${cep}`)
      .call()
      .subscribe(
        res => {
          const address = this.transformResponse(res.result);
          subject.next(address);
        },
        err => {
          subject.error(err);
          subject.next();
        },
        () => {
          subject.complete();
        }
      );
    return subject.asObservable();
  }

  transformResponse(address) {
    delete address.id;
    delete address.gia;
    delete address.complemento;
    delete address.unidade;
    address.cidade = address.localidade;
    delete address.localidade;
    address.cep = address.cep.replace('-', '');
    return address;
  }


  setAddress(cep) {
    this.loading = true;
    this.search(cep)
      .subscribe(address => {
        this.foundAddress.emit(address);
      }, null, () => {
        this.loading = false;
      });
  }

}
