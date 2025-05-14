import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCell, MatHeaderCellDef, MatHeaderRowDef, MatRowDef, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-data-table',
  imports: [CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatIconModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  @Input() heading: string = '';
  @Input() showFilterMenu: boolean = false;
  @Input() displayedColumns: string[] = [];
  @Input() dataSource: any[] = [];
  @Input() searchText: string = '';
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 5;

  @Output() filterSelected = new EventEmitter<string>();
  @Output() searchChanged = new EventEmitter<string>();
  @Output() pageChanged = new EventEmitter<PageEvent>();

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement?.value || ''; 
    console.log('Search text changed:', value);
  }

  onPageChange(event: PageEvent) {
    this.pageChanged.emit(event);
  }
  filterClick(filterType: string) {
    this.filterSelected.emit(filterType);
  }
}
