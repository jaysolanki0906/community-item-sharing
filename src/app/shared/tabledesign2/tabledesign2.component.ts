import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatCellDef, MatHeaderCell, MatHeaderRow, MatHeaderRowDef, MatRowDef, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-tabledesign2',
  imports: [MatMenu,MatMenuTrigger,CommonModule,MatCardModule,MatTableModule,FormsModule,MatIconModule,MatPaginator,MatHeaderRowDef,MatRowDef,MatCellDef],
  templateUrl: './tabledesign2.component.html',
  styleUrl: './tabledesign2.component.scss'
})
export class Tabledesign2Component {
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() showFilterMenu = false;

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() filterSelected = new EventEmitter<string>();

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }

  filterClick(type: string) {
    this.filterSelected.emit(type);
  }
}