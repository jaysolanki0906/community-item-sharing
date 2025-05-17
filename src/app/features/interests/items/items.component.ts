import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { ItemService } from '../../../core/services/item.service';
import { HeaderComponent } from '../../../shared/header/header.component';
import { Item } from '../../../core/models/item.model';
import { InterestService } from '../../../core/services/intrest.service';
import { Interest } from '../../../core/models/interest.model';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatPaginator } from '@angular/material/paginator';
import { Tabledesign2Component } from "../../../shared/tabledesign2/tabledesign2.component";

@Component({
  selector: 'app-items',
  standalone: false,
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  items: Item[] = [];
  interestedItems: string[] = [];
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['id', 'type', 'title', 'description', 'location', 'imageUrl', 'status', 'actions'];
  interestedUsers: Interest[] = [];
  userRole: string = '';
  selectedType: string = 'LOST';
  searchText: string = '';
  totalItems: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;
  loading: boolean = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  actionButtons = [
  { label: 'Interest', icon: 'favorite', type: 'interest' },
  { label: 'View Interested', icon: 'visibility', type: 'viewInterested', showIfAdmin: true }
];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filter: string) {
  this.searchText = filter;
  this.pageIndex = 0;
  this.fetchItems();
}

  handleAction(event: { action: string, row: any }) {
  if (event.action === 'interest') {
    this.markInterest(event.row.id);
  } else if (event.action === 'viewInterested' && this.userRole === 'admin') {
    this.viewInterested(event.row.id);
  }
}

  constructor(
    private itemService: ItemService,
    private interestService: InterestService,
    private router: Router,
  ) {
    this.userRole = (localStorage.getItem('role') || '').toLowerCase();
  }

  ngOnInit(): void {
    this.fetchItems();
  }

  fetchItems(): void {
    const page = this.pageIndex + 1; 
    const limit = this.pageSize;
    const type = 'FREE';
    const status = 'ACTIVE';
    const search = this.searchText;
    this.loading = true;
  
    this.itemService.getItemsWithPagination(page, limit, type, status, search)
      .subscribe({
        next:(response: { data: Item[], total: number }) => {
        this.items = response.data;
        this.totalItems = response.total; 
        this.dataSource.data = this.items; 
        this.loading = false;
      },
    error: (err) => {
      this.loading = false;
        console.error(err);}
    });
  }
  
  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex; 
    this.pageSize = event.pageSize; 
    this.fetchItems(); 
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
