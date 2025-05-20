import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../../shared/header/header.component";
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { InterestService } from '../../../core/services/intrest.service';
import { Tabledesign2Component } from "../../../shared/tabledesign2/tabledesign2.component";

@Component({
  selector: 'app-interested-users',
  standalone: false,
  templateUrl: './interested-users.component.html',
  styleUrls: ['./interested-users.component.scss']
})
export class InterestedUsersComponent {
  displayedColumns: string[] = ['userId', 'name', 'email', 'role', 'interestedOn', 'actions'];
  interestedUsers: any[] = [];
  actionButtons: any[] = [];
  itemId!: number;
  loding = true;
  totalItems = 0;
  pageSize = 10;
  columnHeaders = {
  userId: 'User ID',
  name: 'Name',
  email: 'Email',
  role: 'Role',
  interestedOn: 'Interested On',
  actions: 'Actions'
};

  constructor(private router: Router, private interestService: InterestService) {
  const nav = this.router.getCurrentNavigation();
  this.itemId = nav?.extras?.state?.['itemId'] || localStorage.getItem('selectedItemId') || '';

  const rawUsers = nav?.extras?.state?.['users'] || [];

  this.interestedUsers = rawUsers.map((entry: any) => ({
    userId: entry.user.id,
    name: entry.user.name,
    email: entry.user.email,
    role: entry.user.role,
    interestedOn: entry.createdAt,
    originalUser: entry.user 
  }));

  this.totalItems = this.interestedUsers.length;

  this.setupActionButtons();
}

  setupActionButtons() {
    this.actionButtons = [
      {
        label: 'Assign Receiver',
        icon: 'how_to_reg', 
        callback: 'assignReceiver', 
        color: 'primary'
      }
    ];
  }

  assignReceiver(userId: number) {
    if (!this.itemId) {
      console.error('Cannot assign receiver: itemId is undefined');
      return;
    }
    console.log("Assigning user id", userId);
    this.interestService.assignReceiver(this.itemId, userId).subscribe({
      next: () => alert('Receiver assigned successfully.'),
      error: (err) => {
        alert('Error assigning receiver.');
        console.error(err);
      }
    });
  }

  handleAction(event: { action: string, row: any }) {
    const { action, row } = event;
    const userId = row?.user?.id;
    if (action === 'assignReceiver') {
      this.assignReceiver(userId);
    }
  }

  onPageChange(event: { pageIndex: number, pageSize: number }) {
    console.log('Page changed', event);
  }
}

