import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {  MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatCellDef, MatHeaderRowDef, MatRowDef, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { MatSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-tabledesign2',
  imports: [MatTooltipModule,MatButtonModule,MatSpinner,CommonModule,MatCardModule,MatTableModule,FormsModule,MatIconModule,MatPaginator,MatHeaderRowDef,MatRowDef,MatCellDef],
  templateUrl: './tabledesign2.component.html',
  styleUrl: './tabledesign2.component.scss'
})
export class Tabledesign2Component {
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() showFilterMenu = false;
  @Input() actionButtons: { label: string, icon?: string, type: string }[] = [];
  @Input() Loading = false;
  @Output() actionClicked = new EventEmitter<{ action: string, row: any }>();
  @Input() filterOptions: { label: string, value: string }[] = [];
  constructor(private dialog: MatDialog) {}

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() filterSelected = new EventEmitter<string>();

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }

  filterClick(type: string) {
    this.filterSelected.emit(type);
  }
  
  
  selectedFilter = 'LOST'; 
  
  selectFilter(value: string) {
    this.selectedFilter = value;
    this.filterClick(value); 
  }
  openImageDialog(imageUrl: string) {
  this.dialog.open(ImageDialogComponent, {
    data: { imageUrl },
    width: '2500px'
  });
}

}