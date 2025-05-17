import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyitemsComponent } from './myitems/myitems.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TitleCasePipe } from '../../shared/titlecase.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ItemFormDialogComponent } from './item-form-dialog/item-form-dialog.component';
import { ItemsRoutingModule } from './items-routing.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


@NgModule({
  declarations: [ItemFormDialogComponent,MyitemsComponent],
  imports: [
    CommonModule,
  FormsModule,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatDialogModule,
  MatButtonToggleModule,
  MatIconModule,
  SweetAlert2Module,
  SharedModule,
  ItemsRoutingModule,
  SweetAlert2Module.forRoot()
  ],
  providers: [TitleCasePipe]
})
export class ItemsModule { }
