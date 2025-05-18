import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import {  } from './features/dashboard/item-list/item-list.component';
import { ListusersComponent } from './features/admin/users/listusers/listusers.component';
import { InterestedUsersComponent } from './features/interests/interested-users/interested-users.component';
import { rolebaseGuard } from './core/guards/rolebase.guard';
import { loginGuard } from './core/guards/login.guard';

export const routes: Routes = [
  { path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
    canActivate: [loginGuard]},
  {
    path:'manage-users',
    component:ListusersComponent,
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
  },
  
  {
    path: '',
    redirectTo: '/auth/login', 
     
    pathMatch: 'full'
  },
  {
    path: 'profile', 
    loadChildren: () => import('./features/userinformation/userinformation.module').then(m => m.UserinformationModule),
    canActivate: [authGuard]
  },
  {
    path:'interests',
    loadChildren: () => import('./features/interests/interests.module').then(m => m.InterestsModule),
    canActivate: [authGuard]
  },
  {
    path:'interested-users',
    component:InterestedUsersComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [authGuard]
  },
  {
  path: 'items',
  loadChildren: () => import('./features/items/items.module').then(m => m.ItemsModule),
  canActivate: [authGuard]
},
  { path: '**',
    loadChildren: () => import('./features/notfound/notfound.module').then(m => m.NotfoundModule) 
  }
];
