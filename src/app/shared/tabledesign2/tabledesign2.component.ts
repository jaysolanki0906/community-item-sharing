import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { Item } from '../../core/models/item.model';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

@Component({
  selector: 'app-tabledesign2',
  standalone: false,
  templateUrl: './tabledesign2.component.html',
  styleUrls: ['./tabledesign2.component.scss']
})
export class Tabledesign2Component {
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: string[] = [];
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageIndex: number = 0;
  @Input() showFilterMenu = false;
  @Input() actionButtons: { label: string, icon?: string, type: string }[] = [];
  @Input() Loading = false;
  @Input() filterOptions: any[] = [];
  @Input() columnHeaders: { [key: string]: string } = {};
  @Input() selectedFilter: string = 'LOST';

  @Output() actionClicked = new EventEmitter<{ action: string, row: Item }>();
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() filterSelected = new EventEmitter<string>();

  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private dialog: MatDialog,
    private errorHandler: ErrorHandlerService
  ) {}

  onPageChange(event: PageEvent) {
    try {
      this.pageChange.emit(event);
    } catch (error) {
      this.errorHandler.handleError(error, 'Pagination');
    }
  }

  filterClick(type: string) {
    this.filterSelected.emit(type);
  }

  selectFilter(value: string) {
    this.selectedFilter = value;
    this.filterClick(value);
  }

  handleActionClick(btn: { type: string }, element: Item) {
    try {
      this.actionClicked.emit({ action: btn.type, row: element });
    } catch (error) {
      this.errorHandler.handleError(error, `Action: ${btn.type}`);
    }
  }

  openImageDialog(imageUrl: string): void {
    try {
      this.dialog.open(ImageDialogComponent, {
        data: { imageUrl },
        width: '600px',
        maxHeight: '80vh'
      });
    } catch (error) {
      this.errorHandler.handleError(error, 'OpenImageDialog');
    }
  }

  sortData(column: string) {
    if (this.sortColumn === column) {
      // Toggle sort direction
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    const sortedData = [...this.dataSource].sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];

      // Handle null/undefined
      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      // Use localeCompare for strings, normal comparison for numbers
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return this.sortDirection === 'asc'
          ? (aValue > bValue ? 1 : aValue < bValue ? -1 : 0)
          : (aValue < bValue ? 1 : aValue > bValue ? -1 : 0);
      }
    });
    this.dataSource = sortedData;
  }
}