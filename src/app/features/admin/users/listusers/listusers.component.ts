import { Component } from '@angular/core';
import { AuthServiceService } from '../../../../core/services/auth-service.service';
import { HeaderComponent } from '../../../../shared/header/header.component';
import { MatCell, MatHeaderCell, MatTable, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { UserformComponent } from '../userform/userform.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormField, MatFormFieldControl, MatLabel } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../core/models/user.model';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-listusers',
  imports: [HeaderComponent,MatTableModule,MatButtonModule,MatSlideToggle],
  templateUrl: './listusers.component.html',
  styleUrl: './listusers.component.scss'
})
export class ListusersComponent {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'role','action'];

  constructor(private authService: AuthServiceService,private dialog: MatDialog) {}

  ngOnInit() {
    this.authService.getAllUsers().subscribe((data: User[]) => {
      this.users = data;
    });
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
