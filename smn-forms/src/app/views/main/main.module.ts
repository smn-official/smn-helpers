import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {SharedModule} from '../../shared.module';
import {FormComponent} from './form/form.component';
import {FieldComponent} from './form/field/field.component';
import {CepComponent} from './form/cep/cep.component';
import {CpfComponent} from './form/cpf/cpf.component';
import {AddressComponent} from './form/address/address.component';
import {AutocompleteComponent} from './form/autocomplete/autocomplete.component';
import {SelectComponent} from './form/select/select.component';
import {UiToolbarService} from 'ng-smn-ui';
import {MainComponent} from './main.component';
import {UserService} from '../../core/user/user.service';
import {AuthApiService} from 'smn-auth';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    MainComponent,
    FormComponent,
    FieldComponent,
    AutocompleteComponent,
    SelectComponent,
    AddressComponent,
    CepComponent,
    CpfComponent
  ],
  providers: [UiToolbarService, UserService, AuthApiService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainModule {
}
