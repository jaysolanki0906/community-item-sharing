import { Component, OnInit } from '@angular/core';
import { Item } from '../../../core/models/item.model';
import { ItemService } from '../../../core/services/item.service';
import { MatDialog } from '@angular/material/dialog';
import { ItemFormDialogComponent } from '../item-form-dialog/item-form-dialog.component';
import Swal from 'sweetalert2';
import { RolePermissionService } from '../../../core/services/role-permission.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { RoleService } from '../../../core/services/role.service';

interface Action {
  label: string;
  icon: string;
  type: string;
}

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
  actionButtons: Action[] = [];

  selectedType: string = 'LOST';
  searchText: string = '';

  totalItems: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;
  isLoading: boolean = true;

  currentRole: string = 'USER';

  myFilterOptions = [
    { label: 'Lost', value: 'LOST' },
    { label: 'Found', value: 'FOUND' },
    { label: 'Free', value: 'FREE' },
    { label: 'My Items', value: 'MY_ITEMS' },
    { label: 'Shared With Me', value: 'SHARED' }
  ];
  columnHeaders = {
    id: 'TABLE.ID',
    type: 'TABLE.TYPE',
    title: 'TABLE.TITLE',
    description: 'TABLE.DESCRIPTION',
    location: 'TABLE.LOCATION',
    imageUrl: 'TABLE.IMAGE',
    status: 'TABLE.STATUS',
    actions: 'TABLE.ACTIONS'
  };

  constructor(
    private itemService: ItemService,
    private dialog: MatDialog,
    public rolePermissionService: RolePermissionService,
    private errorHandler: ErrorHandlerService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.roleService.role$.subscribe(role => {
      this.currentRole = (role || 'USER').toUpperCase();
      this.rolePermissionService.setRole(this.currentRole);
      this.setPermittedActionButtons();
      this.fetchItems();
    });
  }

  fetchItems(): void {
    const page = this.pageIndex + 1;
    const limit = this.pageSize;
    const type = this.selectedType;
    const status = 'ACTIVE';
    const search = this.searchText;
    this.isLoading = true;

    const callback = {
      next: (response: { data: Item[], total: number }) => {
        this.items = response.data;
        this.filteredItems = this.items;
        this.totalItems = response.total;
        this.isLoading = false;
      },
      error: (err: unknown) => {
        console.error('Error fetching items:', err);
        this.errorHandler.handleError(err, 'myitems');
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

  addItem(): void {
    const dialogRef = this.dialog.open(ItemFormDialogComponent, {
      width: '500px',
      data: { item: {}, mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(formData => {
      if (formData) {
        this.isLoading = true;
        this.itemService.addItem(formData).subscribe({
          next: () => {
            Swal.fire('Success', 'Item added successfully.', 'success');
            this.fetchItems();
          },
          error: (e) => {
            this.errorHandler.handleError(e, 'addItem');
            this.isLoading = false;
            Swal.fire('Error', 'Failed to add item.', 'error');
          }
        });
      }
    });
  }

  editItem(item: Item): void {
    const dialogRef = this.dialog.open(ItemFormDialogComponent, {
      width: '500px',
      data: { item: item, mode: 'edit' }
    });

    dialogRef.afterClosed().subscribe(formData => {
      if (formData && item.id) {
        this.isLoading = true;
        this.itemService.updateItem(item.id, formData).subscribe({
          next: () => {
            Swal.fire('Success', 'Item updated successfully.', 'success');
            this.fetchItems();
          },
          error: (e) => {
            this.errorHandler.handleError(e, 'editItem');
            this.isLoading = false;
            Swal.fire('Error', 'Failed to update item.', 'error');
          }
        });
      }
    });
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
            this.errorHandler.handleError(error, 'myitems');
            this.isLoading = false;
            Swal.fire('Error', 'Failed to delete item.', 'error');
          }
        });
      }
    });
  }

  applyFilter(selectedType: string): void {
    this.selectedType = selectedType;
    this.pageIndex = 0;
    this.fetchItems();
  }

  onSearchChange(): void {
    this.pageIndex = 0;
    this.fetchItems();
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchItems();
  }

  handleAction(event: { action: string, row: Item }) {
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

  setPermittedActionButtons(): void {
    const actions = [];

    if (this.rolePermissionService.getPermission('items', 'items_edit')) {
      actions.push({ label: 'Edit', icon: 'edit', type: 'edit' });
    }
    if (this.rolePermissionService.getPermission('items', 'items_delete')) {
      actions.push({ label: 'Delete', icon: 'delete', type: 'delete' });
    }
    if (this.rolePermissionService.getPermission('items', 'items_view')) {
      actions.push({ label: 'View', icon: 'visibility', type: 'view' });
    }
    this.actionButtons = actions;
  }
}