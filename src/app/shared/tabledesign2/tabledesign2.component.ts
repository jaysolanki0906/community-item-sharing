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
  filterText: string = '';
  filterField: 'title' | 'description' = 'title';

  constructor(
    private dialog: MatDialog,
    private errorHandler: ErrorHandlerService
  ) {}

  get filteredDataSource(): any[] {
    if (!this.filterText) return this.dataSource;
    const field = this.filterField;
    const filterTextLower = this.filterText.toLowerCase();
    return this.dataSource.filter(item =>
      (item[field] || '').toLowerCase().includes(filterTextLower)
    );
  }

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
    if (column !== 'title' && column !== 'description') return;
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    const sortedData = [...this.dataSource].sort((a, b) => {
      let aValue = a[column];
      let bValue = b[column];

      if (aValue == null) aValue = '';
      if (bValue == null) bValue = '';

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return this.sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return 0;
      }
    });
    this.dataSource = sortedData;
  }

  onFilterTextChange(text: string) {
    this.filterText = text;
  }

  onFilterFieldChange(field: 'title' | 'description') {
    this.filterField = field;
  }

  
  getColumnStyle(col: string) {
    if (col === '#') return { width: '40px', 'max-width': '40px', 'min-width': '40px', 'text-align': 'center' };
    if (col === 'type' || col === 'status' || col === 'role') return { width: '80px', 'max-width': '100px', 'min-width': '60px', 'text-align': 'center' };
    if (col === 'actions') return { width: '110px', 'max-width': '210px', 'min-width': '80px' };
    if (col === 'imageUrl') return { width: '110px', 'max-width': '110px', 'min-width': '90px', 'text-align': 'center' };
    if (col === 'description') return { width: '240px', 'max-width': '240px', 'min-width': '140px' };
    if (col === 'title' || col === 'location' || col === 'name' || col === 'email') return { width: '180px', 'max-width': '180px', 'min-width': '100px' };
    return { 'max-width': '140px', 'min-width': '80px' };
  }
}