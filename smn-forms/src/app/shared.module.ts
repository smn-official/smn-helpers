import {NgModule} from '@angular/core';
import {SMNUIModule} from 'ng-smn-ui';
import {FormsModule} from '@angular/forms';
import {ApiService} from './core/api/api.service';
import {AuthGuard} from './views/auth/guard/auth.guard';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

@NgModule({
    declarations: [],
    exports: [
        CommonModule,
        FormsModule,
        SMNUIModule,
        RouterModule,
    ],
    providers: [ApiService, AuthGuard],
    bootstrap: []
})
export class SharedModule {

}
