import { Component } from '@angular/core';
import { ItemService } from '../../../core/services/item.service';
import { Item } from '../../../core/models/item.model';
import { PageEvent } from '@angular/material/paginator';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { RoleService } from '../../../core/services/role.service';

@Component({
  selector: 'app-item-list',
  standalone: false,
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss'
})
export class ItemListComponent {
  items: any[] = [];
  role: string = 'USER';
  selectedType: 'LOST' | 'FOUND' | 'FREE' = 'LOST';
  displayedColumns: string[] = ['#', 'type', 'title', 'description', 'status'];
  searchText: string = '';
  lostCount: number = 0;
  foundCount: number = 0;
  freeCount: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;
  totalItems: number = 0;
  loading: boolean = true;
  pageIndex: number = 0;
  columnHeaders = {
    '#': '#',
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
    private errorHandler: ErrorHandlerService,
    private roleService: RoleService,
  ) {}

  ngOnInit(): void {
    this.roleService.role$.subscribe(role => {
      this.role = role;
    });
    this.loadItems();
    this.itemcard();
  }

  loadItems(): void {
    this.loading = true;
    this.itemService.getItemsWithPagination(
      this.pageIndex + 1,
      this.pageSize,
      this.selectedType,
      'ACTIVE',
      this.searchText
    ).subscribe({
      next: res => {
        this.items = res.items ?? [];
        this.totalItems = res.page_context?.total ?? 0;
        this.loading = false;
      },
      error: err => {
        this.errorHandler.handleError(err, 'loadItems');
        this.loading = false;
      }
    });
  }

  onTypeChange(type: string): void {
    const allowedTypes: ('LOST' | 'FOUND' | 'FREE')[] = ['LOST', 'FOUND', 'FREE'];
    if (allowedTypes.includes(type as 'LOST' | 'FOUND' | 'FREE')) {
      this.selectedType = type as 'LOST' | 'FOUND' | 'FREE';
      this.currentPage = 1;
      this.loadItems();
    }
  }

  myFilterOptions = [
    { label: 'Lost', value: 'LOST' },
    { label: 'Found', value: 'FOUND' },
    { label: 'Free', value: 'FREE' }
  ];

  itemcard() {
    const page = 1;
    const limit = 1;
    this.itemService.getItemsWithPagination(page, limit, 'LOST', 'ACTIVE', '').subscribe({
      next: (response) => {
        this.lostCount = response.page_context?.total ?? 0;
      },
      error: (err) => {
        this.errorHandler.handleError(err, 'itemcard-lost');
      }
    });

    this.itemService.getItemsWithPagination(page, limit, 'FOUND', 'ACTIVE', '').subscribe({
      next: (response) => {
        this.foundCount = response.page_context?.total ?? 0;
      },
      error: (err) => {
        this.errorHandler.handleError(err, 'itemcard-found');
      }
    });

    this.itemService.getItemsWithPagination(page, limit, 'FREE', 'ACTIVE', '').subscribe({
  next: (response) => {
    this.freeCount = response?.page_context?.total ?? 0;
  },
  error: (err) => {
    this.errorHandler.handleError(err, 'itemcard-free');
  }
});
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadItems();
  }

  onSearchChange(value: string) {
    this.searchText = value;
    this.currentPage = 1;
    this.loadItems();
  }
}