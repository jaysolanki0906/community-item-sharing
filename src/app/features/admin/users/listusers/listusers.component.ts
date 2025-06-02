import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AuthServiceService } from '../../../../core/services/auth-service.service';
import { UserformComponent } from '../userform/userform.component';
import { User } from '../../../../core/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';
import { DialogRef } from '@angular/cdk/dialog';

interface PaginatedUsersResponse {
  data: User[];
  total: number;
}

interface ActionEvent {
  action: string;
  row: User; 
}

// In your template, [dataSource]="users" must be User[]
@Component({
  selector: 'app-listusers',
  standalone: false,
  templateUrl: './listusers.component.html',
  styleUrl: './listusers.component.scss'
})
export class ListusersComponent {
  users: User[] = [];
  displayedColumns: string[] = ['#', 'name', 'email', 'role', 'actions'];
  pageIndex: number = 0;
  pageSize: number = 5;
  totalItems: number = 0;
  loading: boolean = true;

  columnHeaders = {
    id: 'ID',
    actions: 'ACTIONS',
    name: 'NAME',
    email: 'EMAIL',
    role: 'ROLE'
  };

  actionButtons = [
    { label: 'View', icon: 'visibility', type: 'view' },
    { label: 'Update', icon: 'edit', type: 'update' },
    { label: 'Toggle Status', icon: 'toggle_on', type: 'toggleStatus' }
  ];

  constructor(
    private authService: AuthServiceService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.fetchItems();
  }

  fetchItems(): void {
    this.authService.getPaginatedUsers(this.pageIndex + 1, this.pageSize).subscribe({
      next: (response: any) => {
        const usersRaw = response.users || response.data || [];
        this.users = usersRaw.map((u: any) => ({
          ...u,
          isActive: u.is_active
        }));
        this.totalItems = response.page_context?.total || response.total || usersRaw.length;
        this.loading = false;
      },
      error: (error) => {
        this.errorHandler.handleError(error, 'ItemsComponent');
        this.loading = false;
      }
    });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchItems();
  }

  handleAction(event: any): void {
    const user = event.row;
    switch (event.action) {
      case 'view':
        this.dialog.open(UserformComponent, {
          width: '500px',
          data: { item: user, mode: 'view' }
        });
        break;
      case 'update':
        const dialogRef = this.dialog.open(UserformComponent, {
          width: '500px',
          data: { item: user, mode: 'edit' }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.fetchItems(); 
          }
        });
        break;
      case 'toggleStatus':
        this.toggleStatus(user);
        break;
    }
  }

  goToRolesPermissions(): void {
    this.router.navigate(['/manage-users/roleandpermission']);
  }

  toggleStatus(user: any): void {
  const updatedStatus = !user.is_active;
  this.authService.updateUserStatus(user.id, updatedStatus).subscribe({
    next: () => {
      user.is_active = updatedStatus;
      const str = `User ${user.name} is now ${updatedStatus ? 'Active' : 'Inactive'}`;
      this.errorHandler.handleLoginError(null, str);

      const currentUserId = this.authService.getCurrentUserId();
      if (String(user.id) === currentUserId && !updatedStatus) {
        this.authService.logout();
        return;
      }
      this.fetchItems();
    },
    error: (err) => {
      console.error('Failed to update user status', err);
    }
  });
}
goToRolesPermission() {
  this.router.navigate(['/manage-users/rolesandpermission']);
}
}