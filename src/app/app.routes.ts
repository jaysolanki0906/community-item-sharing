import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { rolebaseGuard } from './core/guards/rolebase.guard';
import { loginGuard } from './core/guards/login.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { homeguardGuard } from './core/guards/homeguard.guard';

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
    canActivate: [authGuard, rolebaseGuard,homeguardGuard],
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./features/userinformation/userinformation.module').then(
        (m) => m.UserinformationModule
      ),
    canActivate: [authGuard,homeguardGuard],
  },
  {
    path: 'interests',
    loadChildren: () =>
      import('./features/interests/interests.module').then(
        (m) => m.InterestsModule
      ),
    canActivate: [authGuard,homeguardGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [authGuard,homeguardGuard],
  },
  {
    path: 'items',
    loadChildren: () =>
      import('./features/items/items.module').then((m) => m.ItemsModule),
    canActivate: [authGuard,homeguardGuard],
  },
  {
    path: 'not-found',
    loadComponent: () =>
      import('./features/notfound/notfound/notfound.component').then((m) => m.NotfoundComponent),
  },
  {
    path: 'not-authorized',
    loadChildren: () =>
      import('./features/noauthorizotion/noauthorizotion.module').then((m) => m.NoauthorizotionModule),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/notfound/wildcard/wildcard.component').then(m => m.WildcardComponent)
  }
];