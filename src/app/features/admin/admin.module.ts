import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ListusersComponent } from './users/listusers/listusers.component';
import { UserformComponent } from './users/userform/userform.component';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { RolepermissionComponent } from './rolepermission/rolepermission.component';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateRoleDialogComponent } from './create-role-dialog/create-role-dialog.component';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', component: ListusersComponent },
  { path: 'rolesandpermission', component: RolepermissionComponent },
  {path:'form',component:CreateRoleDialogComponent}
  // { path: 'users', component: UserformComponent },
  // { path: '', redirectTo: 'manage-users', pathMatch: 'full' },
];

@NgModule({
  declarations: [ListusersComponent,UserformComponent,RolepermissionComponent,CreateRoleDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatCheckboxModule,
    MatIconModule,
    MatListModule,
    MatDividerModule,
    RouterModule,
    MatDialogModule,
    HttpClientModule,
  ],
  exports: [ListusersComponent,UserformComponent,RolepermissionComponent,RouterModule,CreateRoleDialogComponent],
})
export class AdminModule { }
