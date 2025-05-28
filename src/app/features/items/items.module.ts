import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyitemsComponent } from './myitems/myitems.component';
import { MatRadioModule } from '@angular/material/radio';
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
import { MatCheckboxModule } from '@angular/material/checkbox';


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
  MatRadioModule,
  MatIconModule,
  SweetAlert2Module,
  SharedModule,
  MatCheckboxModule,
  ItemsRoutingModule,
  SweetAlert2Module.forRoot()
  ],
  providers: [TitleCasePipe]
})
export class ItemsModule { }
