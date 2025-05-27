import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ItemService } from '../../../core/services/item.service';
import { Item } from '../../../core/models/item.model';
import { InterestService } from '../../../core/services/intrest.service';
import { Interest } from '../../../core/models/interest.model';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { RolePermissionService } from '../../../core/services/role-permission.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { UserService } from '../../../core/services/user.service';

interface Action {
  label: string;
  icon: string;
  type: string;
}

@Component({
  selector: 'app-items',
  standalone: false,
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  items: Item[] = [];
  interestedItems: string[] = [];
  dataSource = new MatTableDataSource<Item>();
  displayedColumns: string[] = ['id', 'type', 'title', 'description', 'location', 'imageUrl', 'status', 'actions'];
  interestedUsers: Interest[] = [];
  userRole: string = '';
  selectedType: string = 'LOST';
  searchText: string = '';
  totalItems: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;
  loading: boolean = true;
  @Output() interestedUsersRequested = new EventEmitter<{ users: any[], itemId: string }>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  actionButtons: Action[] = [];

  columnHeaders = {
    id: 'TABLE.ID',
    type: 'TABLE.TYPE',
    title: 'TABLE.TITLE',
    description: 'TABLE.DESCRIPTION',
    location: 'TABLE.LOCATION',
    imageUrl: 'TABLE.IMAGE',
    status: 'TABLE.STATUS',
    actions: 'TABLE.ACTIONS'
  };

  constructor(
    private itemService: ItemService,
    private interestService: InterestService,
    private router: Router,
    private permissionService: RolePermissionService,
    private errorHandler: ErrorHandlerService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.userRole = (user.role || 'USER').toUpperCase();
        this.setupActionButtons();
      },
      error: () => {
        this.userRole = 'USER';
        this.setupActionButtons();
      }
    });

    this.fetchItems();
  }

  setupActionButtons() {
    this.actionButtons = [];
    if (this.permissionService.getPermission('items', 'mark_interest')) {
      this.actionButtons.push({ label: 'Interest', icon: 'favorite', type: 'interest' });
    }
    if (this.permissionService.getPermission('items', 'view_interest')) {
      this.actionButtons.push({ label: 'View Interested', icon: 'visibility', type: 'viewInterested' });
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filter: string) {
    this.searchText = filter;
    this.pageIndex = 0;
    this.fetchItems();
  }

  handleAction(event: { action: string, row: Item }) {
    if (event.action === 'interest') {
      this.markInterest(event.row.id);
    } else if (event.action === 'viewInterested') {
      this.viewInterested(event.row.id);
    }
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
        next: (response: { data: Item[], total: number }) => {
          this.items = response.data;
          this.totalItems = response.total;
          this.dataSource.data = this.items;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.errorHandler.handleError(err, 'ItemsComponent');
        }
      });
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchItems();
  }

  markInterest(itemId: string): void {
    if (!this.permissionService.getPermission('items', 'mark_interest')) {
      console.warn('User does not have permission to mark interest.');
      return;
    }
    if (!this.interestedItems.includes(itemId)) {
      this.interestService.showInterest(itemId).subscribe({
        next: () => {
          this.interestedItems.push(itemId);
          console.log(`Interest shown for item ID: ${itemId}`);
        },
        error: (err) => {
          this.errorHandler.handleError(err, 'ItemsComponent');
        }
      });
    }
  }

  viewInterested(itemId: string): void {
    if (!this.permissionService.getPermission('items', 'view_interest')) {
      console.warn('User does not have permission to view interest.');
      return;
    }
    this.itemService.getItemInterests(itemId).subscribe({
      next: (response) => {
        this.interestedUsersRequested.emit({ users: response, itemId });
        this.router.navigate(['/interests/interested-users'], {
          state: { users: response, itemId: itemId }
        });
      },
      error: (error) => {
        this.errorHandler.handleError(error, 'ItemsComponent');
      }
    });
  }
}