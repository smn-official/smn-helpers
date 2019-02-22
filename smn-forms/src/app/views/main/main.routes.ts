import {Routes} from '@angular/router';
import {FormComponent} from './form/form.component';
import {AuthGuard} from '../auth/guard/auth.guard';
import {MainComponent} from './main.component';

export const MAIN_ROUTES: Routes = [{
  path: '',
  component: MainComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: '',
      component: FormComponent
    }
  ]
}];

