import {NgModule} from '@angular/core';
import {LoginModule} from './login/login.module';
import {SharedModule} from '../../shared.module';

@NgModule({
    imports: [
        SharedModule,
        LoginModule
    ],
    exports: [],
    declarations: [],
    providers: [],
})
export class AuthModule {
}
