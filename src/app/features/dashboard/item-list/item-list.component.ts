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
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonToggleModule,
    FormsModule,
    HeaderComponent,
    DataTableComponent,
    MatMenuModule,
    MatIconModule
  ],
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

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.loadItems();
    this.itemcard();
  }

  loadItems(): void {
    this.itemService.getItems(this.selectedType, this.currentPage, this.pageSize).subscribe(response => {
      this.items = response.data;
      this.totalItems = response.total;
      this.applyFilter();
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
  
  itemcard() {
    const page = 1;
    const limit = 1;
  
    this.itemService.getItems('LOST', page, limit).subscribe(response => {
      this.lostCount = response.total;
    });
  
    this.itemService.getItems('FOUND', page, limit).subscribe(response => {
      this.foundCount = response.total;
    });
  
    this.itemService.getItems('FREE', page, limit).subscribe(response => {
      this.freeCount = response.total;
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
