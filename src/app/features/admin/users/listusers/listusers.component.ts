import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AuthServiceService } from '../../../../core/services/auth-service.service';
import { HeaderComponent } from '../../../../shared/header/header.component';
import { MatCell, MatHeaderCell, MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { UserformComponent } from '../userform/userform.component';
import { User } from '../../../../core/models/user.model';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Tabledesign2Component } from "../../../../shared/tabledesign2/tabledesign2.component";
import { Router } from '@angular/router';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';

interface PaginatedUsersResponse {
  data: User[];
  total: number;
}

interface ActionEvent {
  action: string;
  row: User;
}

@Component({
  selector: 'app-listusers',
  standalone:false,
  templateUrl: './listusers.component.html',
  styleUrl: './listusers.component.scss'
})
export class ListusersComponent {
 users: User[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];
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

  constructor(private authService: AuthServiceService, 
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
      next:(response: PaginatedUsersResponse) => {
      this.users = response.data;
      this.totalItems = response.total;
      this.loading = false;
    },error: (error) => {
      this.errorHandler.handleError(error, 'ItemsComponent');
      this.loading = false;
    }});
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
        this.dialog.open(UserformComponent, {
          width: '500px',
          data: { item: user, mode: 'edit' }
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

  toggleStatus(user: User): void {
  const updatedStatus = !user.isActive;

  this.authService.updateUserStatus(user.id, updatedStatus).subscribe({
    next: () => {
      user.isActive = updatedStatus;
      console.log(`User ${user.id} is now ${updatedStatus ? 'Active' : 'Inactive'}`);
      this.cdr.detectChanges();  
    },
    error: (err) => {
      console.error('Failed to update user status', err);
    }
  });
}
}