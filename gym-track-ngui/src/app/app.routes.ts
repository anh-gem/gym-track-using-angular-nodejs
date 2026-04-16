import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MembersComponent } from './components/members/members.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './components/register/register.component';
import { SettingsComponent } from './components/settings/settings.component';
import { WorkoutsComponent } from './components/workouts/workouts.component';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'welcometogymtrack',
    component: MainLayoutComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard],
      },
      {
        path: 'members',
        component: MembersComponent,
        canActivate: [authGuard],
      },
      {
        path: 'workouts',
        component: WorkoutsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [authGuard],
      },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
