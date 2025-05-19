import { Component } from '@angular/core';
import { ItemService } from '../../../core/services/item.service';
import { Item } from '../../../core/models/item.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { HeaderComponent } from "../../../shared/header/header.component";
import { PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Tabledesign2Component } from "../../../shared/tabledesign2/tabledesign2.component";

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
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  loading = true;
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
    if (allowedTypes.includes(type as any)) {
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
