import { Component } from '@angular/core';
import { ItemService } from '../../../core/services/item.service';
import { Item } from '../../../core/models/item.model';
import { PageEvent } from '@angular/material/paginator';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-item-list',
  standalone: false,
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss'
})
export class ItemListComponent {
  items: Item[] = [];
  selectedType: 'LOST' | 'FOUND' | 'FREE' = 'LOST';
  displayedColumns: string[] = ['id', 'type', 'title', 'description', 'location', 'status'];
  searchText: string = '';
  lostCount: number = 0;
  foundCount: number = 0;
  freeCount: number = 0;
  currentPage:number = 1;
  pageSize:number = 5;
  totalItems:number = 0;
  loading:boolean = true;
  pageIndex:number = 0;
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

  constructor(private itemService: ItemService,
    private errorHandler: ErrorHandlerService,
  ) {}

  ngOnInit(): void {
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
        this.items = res.data;
        this.totalItems = res.total;
        this.loading = false;
      },
      error: err => {
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
    next: (response)=>{
      this.lostCount = response.total;
    },
    error: (err) => {
      console.error(err);
    }
  });

  this.itemService.getItemsWithPagination(page, limit, 'FOUND', 'ACTIVE', '').subscribe({
    next: (response)=>{
      this.foundCount = response.total;
    },
    error: (err) => {
      console.error(err);
    }
  });

  this.itemService.getItemsWithPagination(page, limit, 'FREE', 'ACTIVE', '').subscribe({
    next: (response)=>{
      this.freeCount = response.total;
    },
    error: (err) => {
      console.error(err);
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