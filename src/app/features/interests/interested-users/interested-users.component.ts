import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InterestService } from '../../../core/services/intrest.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-interested-users',
  templateUrl: './interested-users.component.html',
  standalone:false,
  styleUrls: ['./interested-users.component.scss']
})
export class InterestedUsersComponent implements OnInit {
  displayedColumns: string[] = ['#', 'name', 'email', 'role', 'actions'];
  interestedUsers: any[] = [];
  actionButtons: any[] = [];
  itemId: string = '';
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

  constructor(
    private router: Router, 
    private interestService: InterestService,
    private errorservice: ErrorHandlerService
  ) {
    const nav = this.router.getCurrentNavigation();
    if (nav && nav.extras && nav.extras.state) {
      this.itemId = nav.extras.state['itemId'];
      const rawUsers = nav.extras.state['users'] ?? [];
      this.interestedUsers = rawUsers.map((entry: any) => ({
        userId: entry.user.id,
        name: entry.user.name,
        email: entry.user.email,
        role: entry.user.role,
        interestedOn: entry.createdAt,
        originalUser: entry.user 
      }));
    } else {
      this.itemId = '';
      this.interestedUsers = [];
    }
    this.totalItems = this.interestedUsers.length;
    this.setupActionButtons();
  }

  ngOnInit() {
    // Optionally, fetch fresh interests from API here using this.itemId
    // this.fetchInterestedUsers();
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

  assignReceiver(userId: string) {
    if (!this.itemId) {
      this.errorservice.handleError('Cannot assign receiver: itemId is undefined', 'InterestedUsersComponent');
      return;
    }
    this.interestService.assignReceiver(Number(this.itemId), Number(userId)).subscribe({
      next: () => alert('Receiver assigned successfully.'),
      error: (err) => {
        this.errorservice.handleError(err, 'interested-users.component.ts')
      }
    });
  }

  handleAction(event: { action: string, row: any }) {
    const { action, row } = event;
    const userId = row?.userId;
    if (action === 'assignReceiver') {
      this.assignReceiver(userId);
    }
  }

  onPageChange(event: { pageIndex: number, pageSize: number }) {
    console.log('Page changed', event);
  }
}