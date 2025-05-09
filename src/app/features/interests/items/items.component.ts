import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ItemService } from '../../../core/services/item.service';
import { HeaderComponent } from '../../../shared/header/header.component';
import { Item } from '../../../core/models/item.model';
import { InterestService } from '../../../core/services/intrest.service';
import { Interest } from '../../../core/models/interest.model';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    HeaderComponent,
  ],
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  items: Item[] = [];
  interestedItems: string[] = [];
  displayedColumns: string[] = ['id', 'type', 'title', 'description', 'location', 'imageUrl', 'status', 'actions'];
  interestedUsers: Interest[] = [];
  userRole: string = '';

  constructor(
    private itemService: ItemService,
    private interestService: InterestService,
    private router: Router
  ) {
    this.userRole = (localStorage.getItem('role') || '').toLowerCase();
  }

  ngOnInit(): void {
    this.fetchAllItems();
  }

  fetchAllItems(): void {
    this.itemService.getItems('FREE').subscribe({
      next: (response: any) => {
        this.items = response.data;
      },
      error: (err) => {
        console.error('Failed to fetch items:', err);
      }
    });
  }

  markInterest(itemId: string): void {
    if (!this.interestedItems.includes(itemId)) {
      this.interestService.showInterest(itemId).subscribe({
        next: () => {
          this.interestedItems.push(itemId);
          console.log(`Interest shown for item ID: ${itemId}`);
        },
        error: (err) => {
          console.error(`Failed to show interest for item ID: ${itemId}`, err);
        }
      });
    }
  }

  viewInterested(itemId: string): void {
    localStorage.setItem('selectedItemId', itemId);
    this.itemService.getItemInterests(itemId).subscribe({
      next: (response) => {
        this.router.navigate(['/interested-users'], {
          state: { users: response, itemId: itemId }
        });
      },
      error: (error) => {
        console.error('Failed to fetch interests:', error);
      }
    });
  }
}
