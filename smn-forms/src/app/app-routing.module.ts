import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AUTH_ROUTES} from './views/auth/auth.routes';
import {MAIN_ROUTES} from './views/main/main.routes';

const routes: Routes = [
  ...AUTH_ROUTES,
  ...MAIN_ROUTES
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
