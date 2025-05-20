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
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';

import { HttpClientModule } from '@angular/common/http';
import { RolepermissionComponent } from './rolepermission/rolepermission.component';

const routes: Routes = [
  { path: '', component: ListusersComponent },
  { path:'roleandpermission',component:RolepermissionComponent },
];

@NgModule({
  declarations: [ListusersComponent,UserformComponent,RolepermissionComponent],
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
  exports: [ListusersComponent,UserformComponent,RouterModule,RolepermissionComponent],
})
export class AdminModule { }
