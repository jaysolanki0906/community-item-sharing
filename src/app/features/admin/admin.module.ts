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
import { MatOption, MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { HttpClientModule } from '@angular/common/http';
import { MatOptionModule } from '@angular/material/core';

const routes: Routes = [
  { path: '', component: ListusersComponent },
];

@NgModule({
  declarations: [ListusersComponent,UserformComponent],
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
    MatOptionModule,
    MatDividerModule,
    RouterModule,
    MatDialogModule,
    MatExpansionModule,
    HttpClientModule,
  ],
  exports: [ListusersComponent,UserformComponent,RouterModule],
})
export class AdminModule { }
