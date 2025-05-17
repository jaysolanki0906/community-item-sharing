import { Component, OnInit } from '@angular/core';
import { Item } from '../../../core/models/item.model';
import { ItemService } from '../../../core/services/item.service';
import { MatDialog } from '@angular/material/dialog';
import { ItemFormDialogComponent } from '../item-form-dialog/item-form-dialog.component';
import { HttpResponse } from '@angular/common/http';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-myitems',
  templateUrl: './myitems.component.html',
  styleUrls: ['./myitems.component.scss'],
  standalone: false,
})
export class MyitemsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'type', 'title', 'description', 'location', 'status', 'imageUrl', 'actions'];
  items: Item[] = [];
  filteredItems: Item[] = [];
  selectedType: string = 'LOST';
  searchText: string = '';
  totalItems: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;
  isLoading: boolean = true;

  constructor(private itemService: ItemService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchItems();
  }

  myFilterOptions = [
    { label: 'Lost', value: 'LOST' },
    { label: 'Found', value: 'FOUND' },
    { label: 'Free', value: 'FREE' },
    { label: 'My Items', value: 'MY_ITEMS' },
    { label: 'Shared By Me', value: 'SHARED' }
  ];

  fetchItems(): void {
    const page = this.pageIndex + 1;
    const limit = this.pageSize;
    this.isLoading = true;
    const type = this.selectedType;
    const status = 'ACTIVE';
    const search = this.searchText;

    const callback = {
      next: (response: { data: Item[], total: number }) => {
        this.items = response.data;
        this.filteredItems = this.items;
        this.totalItems = response.total;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
      }
    };

    if (type === 'MY_ITEMS') {
      this.itemService.getMyItems(page, limit, status, search).subscribe(callback);
    } else if (type === 'SHARED') {
      this.itemService.getSharedItems(page, limit, status, search).subscribe(callback);
    } else {
      this.itemService.getItemsWithPagination(page, limit, type, status, search).subscribe(callback);
    }
  }

  applyFilter(selectedType: string): void {
    this.selectedType = selectedType;
    this.pageIndex = 0;
    this.fetchItems();
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchItems();
  }

  addItem(): void {
    const dialogRef = this.dialog.open(ItemFormDialogComponent, {
      width: '500px',
      data: { item: {}, mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchItems();
      }
    });
  }

  editItem(item: Item): void {
    const dialogRef = this.dialog.open(ItemFormDialogComponent, {
      width: '500px',
      data: { item: item, mode: 'edit' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchItems();
      }
    });
  }

  handleAction(event: { action: string, row: any }) {
    switch (event.action) {
      case 'edit':
        this.editItem(event.row);
        break;
      case 'delete':
        this.deleteItem(event.row.id);
        break;
      case 'view':
        this.viewItem(event.row);
        break;
    }
  }

  viewItem(item: Item): void {
    this.dialog.open(ItemFormDialogComponent, {
      width: '500px',
      data: { item: item, mode: 'view' }
    });
  }

  deleteItem(id: string): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to delete this item?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then((result) => {
    if (result.isConfirmed) {
      this.isLoading = true;
      this.itemService.deleteItem(id).subscribe({
  next: () => {
    Swal.fire('Deleted!', 'The item has been deleted.', 'success').then(() => {
      this.fetchItems();
    });
  },
  error: (error) => {
    console.error('Delete error:', error);
    this.isLoading = false;
    Swal.fire('Error', 'Failed to delete item.', 'error');
  }
});
    }
  });
}

}
