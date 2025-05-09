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
    HeaderComponent
  ],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.scss'
})
export class ItemListComponent {
  items: Item[] = [];
  filteredItems: Item[] = [];
  selectedType: 'LOST' | 'FOUND' | 'FREE' = 'LOST';
  searchText: string = '';

  constructor(private itemService: ItemService) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.itemService.getItems(this.selectedType).subscribe(response => {
      this.items = response.data; // ✅ use response.data instead of response
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

  onTypeChange(type: 'LOST' | 'FOUND' | 'FREE'): void {
    this.selectedType = type;
    this.loadItems();
  }
}
