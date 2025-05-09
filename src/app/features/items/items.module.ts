import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyitemsComponent } from './myitems/myitems.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TitleCasePipe } from '../../shared/titlecase.pipe';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MyitemsComponent,
    MatTableModule, 
    MatPaginatorModule, 
    MatSortModule, 
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TitleCasePipe
  ],
  providers: [TitleCasePipe]
})
export class ItemsModule { }
