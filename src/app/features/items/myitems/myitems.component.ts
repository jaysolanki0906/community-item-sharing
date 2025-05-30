import { Component, OnInit, OnDestroy } from '@angular/core';
import { Item } from '../../../core/models/item.model';
import { ItemService } from '../../../core/services/item.service';
import { MatDialog } from '@angular/material/dialog';
import { ItemFormDialogComponent } from '../item-form-dialog/item-form-dialog.component';
import Swal from 'sweetalert2';
import { RolePermissionService } from '../../../core/services/role-permission.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { RoleService } from '../../../core/services/role.service';
import { Subscription } from 'rxjs';
// If you have a dialog for updating permissions, import it here
// import { RolePermissionsDialogComponent } from '../rolespermission/role-permissions-dialog.component';

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
export class MyitemsComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['#', 'type', 'title', 'description', 'status', 'imageUrl', 'actions'];
  items: Item[] = [];
  filteredItems: Item[] = [];
  actionButtons: Action[] = [];
  private roleSubscription!: Subscription;

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
    '#': '#',
    type: 'TABLE.TYPE',
    title: 'TABLE.TITLE',
    description: 'TABLE.DESCRIPTION',
    location: 'TABLE.LOCATION',
    imageUrl: 'TABLE.IMAGE',
    status: 'TABLE.STATUS',
    actions: 'TABLE.ACTIONS'
  };

  // For demonstration, manage roles here (in reality, this would be in a dedicated component)
  roles: any[] = [];
  selectedRole: any = null;

  constructor(
    private itemService: ItemService,
    private dialog: MatDialog,
    public rolePermissionService: RolePermissionService,
    private errorHandler: ErrorHandlerService,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.roleSubscription = this.roleService.role$.subscribe(role => {
      this.currentRole = (role || 'USER').toUpperCase();
      this.rolePermissionService.setRole(this.currentRole);
      this.setPermittedActionButtons();
      this.fetchItems();
    });
    this.fetchRoles();
  }

  fetchItems(): void {
    const page = this.pageIndex + 1;
    const limit = this.pageSize;
    const type = this.selectedType;
    const status = 'ACTIVE';
    const search = this.searchText;
    this.isLoading = true;

    const mapImageUrl = (items: any[]) =>
      (items ?? []).map(item => ({
        ...item,
        imageUrl: item.image_url // map API field to what template expects
      }));

    if (type === 'MY_ITEMS') {
      this.itemService.getMyItems(page, limit, status, search).subscribe({
        next: (response) => {
          this.items = mapImageUrl(response.items);
          this.filteredItems = this.items;
          this.totalItems = response.page_context?.total ?? 0;
          this.isLoading = false;
        },
        error: (err: unknown) => {
          console.error('Error fetching items:', err);
          this.errorHandler.handleError(err, 'myitems');
          this.isLoading = false;
        }
      });
    } else if (type === 'SHARED') {
      this.itemService.getSharedItems(page, limit, status, search).subscribe({
        next: (response) => {
          this.items = mapImageUrl(response.items);
          this.filteredItems = this.items;
          this.totalItems = response.page_context?.total ?? 0;
          this.isLoading = false;
        },
        error: (err: unknown) => {
          console.error('Error fetching items:', err);
          this.errorHandler.handleError(err, 'myitems');
          this.isLoading = false;
        }
      });
    } else {
      this.itemService.getItemsWithPagination(page, limit, type, status, search).subscribe({
        next: (response) => {
          this.items = mapImageUrl(response.items);
          this.filteredItems = this.items;
          this.totalItems = response.page_context?.total ?? 0;
          this.isLoading = false;
        },
        error: (err: unknown) => {
          console.error('Error fetching items:', err);
          this.errorHandler.handleError(err, 'myitems');
          this.isLoading = false;
        }
      });
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
            this.isLoading = false;
            Swal.fire(e, 'Failed to update item.', 'error');
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

  // ---------- ROLES & PERMISSIONS CRUD SECTION ----------
  fetchRoles(): void {
    this.rolePermissionService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (err) => {
        this.errorHandler.handleError(err, 'fetchRoles');
      }
    });
  }

  createRole(): void {
    const payload = { name: 'New Role', auth_items: {} };
    this.rolePermissionService.createRole(payload).subscribe({
      next: () => {
        Swal.fire('Success', 'Role created successfully.', 'success');
        this.fetchRoles();
      },
      error: (e) => {
        this.errorHandler.handleError(e, 'createRole');
        Swal.fire('Error', 'Failed to create role.', 'error');
      }
    });
  }

  editRole(role: any): void {
    // Example: only updating name
    const payload = { name: 'Updated Name' };
    this.rolePermissionService.updateRole(role.id, payload).subscribe({
      next: () => {
        Swal.fire('Success', 'Role updated successfully.', 'success');
        this.fetchRoles();
      },
      error: (e) => {
        this.errorHandler.handleError(e, 'editRole');
        Swal.fire('Error', 'Failed to update role.', 'error');
      }
    });
  }

  patchRole(role: any, updatedPermissions: any): void {
    // Partial update for permissions (auth_items)
    const payload = { auth_items: updatedPermissions };
    this.rolePermissionService.patchRole(role.id, payload).subscribe({
      next: () => {
        Swal.fire('Success', 'Role permissions updated successfully.', 'success');
        this.fetchRoles();
      },
      error: (e) => {
        this.errorHandler.handleError(e, 'patchRole');
        Swal.fire('Error', 'Failed to update role permissions.', 'error');
      }
    });
  }

  deleteRole(role: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this role?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rolePermissionService.deleteRole(role.id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'The role has been deleted.', 'success').then(() => {
              this.fetchRoles();
            });
          },
          error: (error) => {
            this.errorHandler.handleError(error, 'deleteRole');
            Swal.fire('Error', 'Failed to delete role.', 'error');
          }
        });
      }
    });
  }

  updateRolePermissions(role: any): void {
    const updatedPermissions = role.auth_items; // In real use, get from dialog/form

    this.patchRole(role, updatedPermissions);
  }

  ngOnDestroy(): void {
    if (this.roleSubscription) {
      this.roleSubscription.unsubscribe();
    }
  }
}