import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {LoginComponent} from './login.component';
import {SharedModule} from '../../../shared.module';

@NgModule({
    imports: [
        SharedModule
    ],
    exports: [],
    declarations: [LoginComponent],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginModule {
}
