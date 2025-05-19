import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';

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
  @Input() pageIndex: number = 0; // NEW
  @Input() showFilterMenu = false;
  @Input() actionButtons: { label: string, icon?: string, type: string }[] = [];
  @Input() Loading = false;
  @Input() filterOptions: any[] = [];

  @Output() actionClicked = new EventEmitter<{ action: string, row: any }>();
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() filterSelected = new EventEmitter<string>();

  selectedFilter = 'LOST';

  constructor(private dialog: MatDialog) {}

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }

  filterClick(type: string) {
    this.filterSelected.emit(type);
  }

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
