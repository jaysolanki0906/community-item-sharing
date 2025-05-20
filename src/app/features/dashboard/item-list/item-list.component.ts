import { Component } from '@angular/core';
import { ItemService } from '../../../core/services/item.service';
import { Item } from '../../../core/models/item.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-item-list',
  standalone: false,
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss'
})
export class ItemListComponent {
  items: Item[] = [];
  filteredItems: Item[] = [];
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

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.loadItems();
    this.itemcard();
  }

  loadItems(): void {
    this.loading = true;
    this.itemService.getItems(this.selectedType, this.currentPage, this.pageSize).subscribe({
       next: (response)=>{
      this.totalItems = response.total;
      this.items = response.data;
      this.filteredItems = this.items;
      this.applyFilter();
      this.loading = false;
    },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
  
  applyFilter(): void {
    const text = this.searchText.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      item.title.toLowerCase().includes(text) ||
      item.description.toLowerCase().includes(text)
    );
  }

  onTypeChange(type: string): void {
    const allowedTypes: ('LOST' | 'FOUND' | 'FREE')[] = ['LOST', 'FOUND', 'FREE'];
    if (allowedTypes.includes(type as 'LOST' | 'FOUND' | 'FREE')) {
      this.selectedType = type as 'LOST' | 'FOUND' | 'FREE';
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
  
    this.itemService.getItems('LOST', page, limit).subscribe({
       next: (response)=>{
      this.lostCount = response.total;
      this.loading = false;
    },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  
    this.itemService.getItems('FOUND', page, limit).subscribe({
       next: (response)=>{
      this.foundCount = response.total;
      this.loading = false;
    },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  
    this.itemService.getItems('FREE', page, limit).subscribe({
       next: (response)=>{
      this.freeCount = response.total;
      this.loading = false;
    },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1; 
    this.loadItems();
  }
  onSearchChange(value: string) {
    this.searchText = value;
    this.applyFilter();
  }
}
