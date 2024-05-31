
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found-component';
import { AuthorizationComponent } from './components/authorization/authorization.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { MessengerMainPageComponent } from './components/messenger-main-page/messenger-main-page.component';
import { AuthGuardService } from './service/auth-guard.service';

const routes: Routes = [
  { path: 'home',             component: HomePageComponent },
  { path: 'login',            component: AuthorizationComponent },
  { path: 'registr',          component: RegistrationComponent },
  { path: 'messenge',         component: MessengerMainPageComponent, canActivate: [AuthGuardService] },
  // { path: 'table-student',    component: StudentTableComponent,   canActivate: [AuthGuardService] },
  // { path: 'table-admin',      component: AdminTableComponent,     canActivate: [AuthGuardService] },
  // { path: 'table-teacher',    component: TeacherTableComponent,   canActivate: [AuthGuardService] },
  // { path: 'personal-page',    component: PersonalTableComponent,  canActivate: [AuthGuardService] },
  { path: '',                 redirectTo: 'home', pathMatch: 'full' },
  { path: '**',               component: PageNotFoundComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
