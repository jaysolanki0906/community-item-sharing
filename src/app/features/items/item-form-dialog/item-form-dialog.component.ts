import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item } from '../../../core/models/item.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TitleCasePipe } from '../../../shared/titlecase.pipe';
import { ItemService } from '../../../core/services/item.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-item-form-dialog',
  templateUrl: './item-form-dialog.component.html',
  styleUrls: ['./item-form-dialog.component.scss'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule
  ]
})
export class ItemFormDialogComponent {
  itemForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private dialogRef: MatDialogRef<ItemFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: Partial<Item>, mode: 'add' | 'edit' | 'view' },
    private titleCasePipe: TitleCasePipe
  ) {
    const token = localStorage.getItem('token');
    let userId = '';

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.user_id || payload.id || ''; 
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    }

    this.itemForm = this.fb.group({
      title: [data.item?.title || '', Validators.required],
      description: [data.item?.description || '', Validators.required],
      location: [data.item?.location || '', Validators.required],
      type: [data.item?.type || '', Validators.required],
      status: [data.item?.status || 'ACTIVE', Validators.required],
      image_url: [data.item?.imageUrl || ''],
      user_id: [data.item?.id || userId, Validators.required]
    });

    if (this.isViewMode) {
      this.itemForm.disable();
    }
  }

  get isViewMode(): boolean {
    return this.data.mode === 'view';
  }

  get modeTitle(): string {
    return this.titleCasePipe.transform(this.data.mode) + ' Item';
  }

  onFileChange(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
    }
  }
  
  submit(): void {
    if (this.itemForm.invalid) return;
  
    const formData = new FormData();
    formData.append('title', this.itemForm.get('title')?.value);
    formData.append('description', this.itemForm.get('description')?.value);
    formData.append('location', this.itemForm.get('location')?.value);
    formData.append('type', this.itemForm.get('type')?.value);
    formData.append('status', this.itemForm.get('status')?.value);
    // formData.append('userId', this.itemForm.get('user_id')?.value);
  
    if (this.selectedFile) {
      formData.append('itemImage', this.selectedFile); 
    }
  
    if (this.data.mode === 'add') {
      this.itemService.addItem(formData).subscribe(
        (createdItem) => {
          this.dialogRef.close(createdItem);
        },
        (error) => {
          console.error('Error adding item:', error);
        }
      );
    } else if (this.data.mode === 'edit') {
      const itemId = this.data.item?.id || '';
      this.itemService.updateItem(itemId, formData).subscribe(
        (updatedItem) => {
          this.dialogRef.close(updatedItem);
        },
        (error) => {
          console.error('Error updating item:', error);
        }
      );
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
