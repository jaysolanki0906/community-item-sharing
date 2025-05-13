import { Component, OnInit } from '@angular/core';
import { Item } from '../../../core/models/item.model';
import { ItemService } from '../../../core/services/item.service';
import { MatDialog } from '@angular/material/dialog';
import { ItemFormDialogComponent } from '../item-form-dialog/item-form-dialog.component';
import { HeaderComponent } from '../../../shared/header/header.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-myitems',
  templateUrl: './myitems.component.html',
  styleUrls: ['./myitems.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatButtonToggleModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButton,
    HeaderComponent,
    CommonModule,
    MatPaginator,
    MatCard
  ]
})
export class MyitemsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'type', 'title', 'description', 'location', 'status', 'image', 'actions'];
  items: Item[] = [];
  filteredItems: Item[] = [];
  selectedType: string = 'LOST';
  searchText: string = '';
  totalItems: number = 0;
  pageSize: number = 5;
  pageIndex: number = 0;

  constructor(private itemService: ItemService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchItems();
  }

  fetchItems(): void {
    const page = this.pageIndex + 1;
    const limit = this.pageSize;
    const type = this.selectedType;
    const status = 'ACTIVE';
    const search = this.searchText;
  
    if (type === 'My items') {
      this.itemService.getMyItems(page, limit, status, search).subscribe((response: { data: Item[], total: number }) => {
        this.items = response.data;
        this.filteredItems = this.items;
        this.totalItems = response.total;
      });
    } 
    else if (type === 'Shared By Me') {
      this.itemService.getSharedItems(page, limit, status, search).subscribe((response: { data: Item[], total: number }) => {
        this.items = response.data;
        this.filteredItems = this.items;
        this.totalItems = response.total;
      });
    }
    else {
      this.itemService.getItemsWithPagination(page, limit, type, status, search).subscribe((response: { data: Item[], total: number }) => {
        this.items = response.data;
        this.filteredItems = this.items;
        this.totalItems = response.total;
      });
    }
  }
  

  applyFilter(): void {
    this.pageIndex = 0; 
    this.fetchItems(); 
  }

  onPageChange(event: any): void {
    this.pageIndex = event.pageIndex; 
    this.pageSize = event.pageSize; 
    this.fetchItems(); 
  }

  addItem(): void {
    const dialogRef = this.dialog.open(ItemFormDialogComponent, {
      width: '500px',
      data: { item: {}, mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchItems();
      }
    });
  }

  editItem(item: Item): void {
    const dialogRef = this.dialog.open(ItemFormDialogComponent, {
      width: '500px',
      data: { item: item, mode: 'edit' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchItems();
      }
    });
  }

  viewItem(item: Item): void {
    this.dialog.open(ItemFormDialogComponent, {
      width: '500px',
      data: { item: item, mode: 'view' }
    });
  }

  deleteItem(id: string): void {
    if (confirm('Are you sure you want to delete this item?')) {
      this.itemService.deleteItem(id).subscribe(() => {
        this.fetchItems();
      });
    }
  }
}
