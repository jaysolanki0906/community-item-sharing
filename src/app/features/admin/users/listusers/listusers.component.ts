import { Component, ViewChild } from '@angular/core';
import { AuthServiceService } from '../../../../core/services/auth-service.service';
import { HeaderComponent } from '../../../../shared/header/header.component';
import { MatCell, MatHeaderCell, MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { UserformComponent } from '../userform/userform.component';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormField, MatFormFieldControl, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../core/models/user.model';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-listusers',
  imports: [HeaderComponent,MatTableModule,MatButtonModule,MatSlideToggle,MatPaginator],
  templateUrl: './listusers.component.html',
  styleUrl: './listusers.component.scss'
})
export class ListusersComponent {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'role','action'];
  pageIndex: number = 0;
  pageSize: number = 5;
  totalItems: number = 0;

  constructor(private authService: AuthServiceService,private dialog: MatDialog) {}

  ngOnInit() {
    this.fetchItems();
  }
  fetchItems(): void {
    this.authService.getPaginatedUsers(this.pageIndex + 1, this.pageSize).subscribe((response: any) => {
      this.users = response.data;     
      this.totalItems = response.total; 
    });
  }
  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchItems(); 
  }

  viewItem(item: User): void {
      this.dialog.open(UserformComponent, {
        width: '500px',
        data: { item: item, mode: 'view' }
      });
    }
    updateItem(user: User): void {
      this.dialog.open(UserformComponent, {
        width: '500px',
        data: { item: user, mode: 'edit' }
      });
    }
    toggleStatus(user: User): void {
      const updatedStatus = !user.isActive;
    
      this.authService.updateUserStatus(user.id, updatedStatus).subscribe({
        next: () => {
          user.isActive = updatedStatus; // Update local value
          console.log(`User ${user.id} is now ${updatedStatus ? 'Active' : 'Inactive'}`);
        },
        error: (err) => {
          console.error('Failed to update user status', err);
        }
      });
    }
    
    
}
