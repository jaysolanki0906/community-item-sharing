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
    component:ListusersComponent
  },
  {
    path:'assign-items',
    component:GiveawayComponent
  },
  {
    path: '',
    redirectTo: '/auth/login',  
    pathMatch: 'full'
  },
  {
    path: 'profile', 
    component:UserinfoComponent
  },
  {
    path:'interests',
    component:ItemsComponent
  },
  {
    path:'interested-users',
    component:InterestedUsersComponent
  },
  {
    path: 'dashboard',
    component: ItemListComponent,
    // canActivate: [authGuard]
  },
  {
    path: 'items',
    component: MyitemsComponent,
    children:[{path:'itemsform',component:ItemFormDialogComponent}]
  },
  // {
  //   path: '**',  
  //   redirectTo: '/auth/login'  
  // }
  
];
