import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../../shared/header/header.component";
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { InterestService } from '../../../core/services/intrest.service';

@Component({
  selector: 'app-interested-users',
  standalone: true,
  imports: [HeaderComponent, CommonModule, MatTableModule],
  templateUrl: './interested-users.component.html',
  styleUrls: ['./interested-users.component.scss']
})
export class InterestedUsersComponent {
  displayedColumns: string[] = ['userId', 'name', 'email', 'role', 'interestedOn', 'action'];
  interestedUsers: any[] = [];
  itemId!: number;

  constructor(private router: Router, private interestService: InterestService) {
    const nav = this.router.getCurrentNavigation();
    this.itemId = nav?.extras?.state?.['itemId'] || localStorage.getItem('selectedItemId') || '';
    this.interestedUsers = nav?.extras?.state?.['users'] || [];
    console.log('Item ID received:', this.itemId);  
  }

  assignReceiver(userId: number) {
    if (!this.itemId) {
      console.error('Cannot assign receiver: itemId is undefined');
      return;
    }
    console.log("Thisis user id",userId);
    this.interestService.assignReceiver(this.itemId, userId).subscribe({
      next: (res) => {
        alert('Receiver assigned successfully.');
      },
      error: (err) => {
        alert('Error assigning receiver.');
        console.error(err);
      }
    });
  }
}
