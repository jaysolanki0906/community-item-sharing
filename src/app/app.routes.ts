import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { authGuard } from './core/guards/auth.guard';
import {  } from './features/dashboard/item-list/item-list.component';
import { ItemListComponent } from './features/dashboard/item-list/item-list.component';
import { MyitemsComponent } from './features/items/myitems/myitems.component';
import { ItemFormDialogComponent } from './features/items/item-form-dialog/item-form-dialog.component';
import { UserinfoComponent } from './features/userinformation/userinfo/userinfo.component';
import { ItemsComponent } from './features/interests/items/items.component';
import { UserformComponent } from './features/admin/users/userform/userform.component';
import { GiveawayComponent } from './features/admin/giveaway/giveaway.component';
import { ListusersComponent } from './features/admin/users/listusers/listusers.component';
import { InterestedUsersComponent } from './features/interests/interested-users/interested-users.component';
import { rolebaseGuard } from './core/guards/rolebase.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ]
  },
  {
    path:'manage-users',
    component:ListusersComponent,
    canActivate: [rolebaseGuard]
  },
  {
    path:'assign-items',
    component:GiveawayComponent,
    canActivate: [rolebaseGuard]
  },
  {
    path: '',
    redirectTo: '/auth/login',  
    pathMatch: 'full'
  },
  {
    path: 'profile', 
    component:UserinfoComponent,
    canActivate: [authGuard]
  },
  {
    path:'interests',
    component:ItemsComponent,
    canActivate: [authGuard]
  },
  {
    path:'interested-users',
    component:InterestedUsersComponent,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    component: ItemListComponent,
    canActivate: [authGuard]
  },
  {
    path: 'items',
    component: MyitemsComponent,
    children:[{path:'itemsform',component:ItemFormDialogComponent,canActivate: [authGuard]}],
    canActivate: [authGuard]
  },
  {
    path: '**',  
    redirectTo: '/auth/login'  
  }
  
];
