import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { rolebaseGuard } from './core/guards/rolebase.guard';
import { loginGuard } from './core/guards/login.guard';
import { InterestedUsersComponent } from './features/interests/interested-users/interested-users.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { nofoundguardGuard } from './core/guards/nofoundguard.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard]
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'manage-users',
    loadChildren: () =>
      import('./features/admin/admin.module').then((m) => m.AdminModule),
    canActivate: [authGuard, rolebaseGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./features/userinformation/userinformation.module').then(
        (m) => m.UserinformationModule
      ),
    canActivate: [authGuard],
  },
  {
    path: 'interests',
    loadChildren: () =>
      import('./features/interests/interests.module').then(
        (m) => m.InterestsModule
      ),
    canActivate: [authGuard],
  },
  
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [authGuard],
  },
  {
    path: 'items',
    loadChildren: () =>
      import('./features/items/items.module').then((m) => m.ItemsModule),
    canActivate: [authGuard],
  },
  {
    path: 'not-found',
    loadChildren: () =>
      import('./features/notfound/notfound.module').then((m) => m.NotfoundModule),
    canActivate: [nofoundguardGuard],
  },
  {
    path: 'not-authorized',
    loadChildren: () =>
      import('./features/noauthorizotion/noauthorizotion.module').then((m) => m.NoauthorizotionModule),
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full',
  }
];
