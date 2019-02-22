import {Component, OnDestroy, OnInit} from '@angular/core';
import {UiToolbarService} from 'ng-smn-ui';
import {Title} from '@angular/platform-browser';
import {ParamsField} from './field/field.model';

@Component({
  selector: 'ui-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {

  info: any;
  field: ParamsField;

  constructor(
    private toolbarService: UiToolbarService,
    private titleService: Title
  ) {
    this.info = {
      cpf: '04286420477'
    };

    this.field = {
      label: 'Nome',
      name: 'nome',
      required: true,
      type: 'text',
      maxLength: 100
    };


  }

  ngOnInit() {
    this.titleService.setTitle('Forms');
    this.toolbarService.set('Forms');
    this.toolbarService.activateExtendedToolbar(600);

  }

  ngOnDestroy() {
    this.titleService.setTitle('Forms');
    this.toolbarService.set('');
  }

}
