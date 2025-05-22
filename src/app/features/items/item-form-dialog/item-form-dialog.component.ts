import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Item } from '../../../core/models/item.model';
import { TitleCasePipe } from '../../../shared/titlecase.pipe';
import { ItemService } from '../../../core/services/item.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-item-form-dialog',
  templateUrl: './item-form-dialog.component.html',
  styleUrls: ['./item-form-dialog.component.scss'],
  standalone: false,
})
export class ItemFormDialogComponent {
  itemForm: FormGroup;
  imageError: string = '';
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private dialog: MatDialog,
    private errorservice: ErrorHandlerService,
    private dialogRef: MatDialogRef<ItemFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: Partial<Item>, mode: 'add' | 'edit' | 'view' },
    private titleCasePipe: TitleCasePipe,
    
  ) {
    const token = localStorage.getItem('token');
    let userId = '';

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.user_id || payload.id || ''; 
      } catch (e) {
        this.errorservice.handleError( e, 'ItemFormDialogComponent')
      }
    }

    this.itemForm = this.fb.group({
  title: [data.item?.title || '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
  description: [data.item?.description || '', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
  location: [data.item?.location || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
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
  const file = fileInput.files?.[0];
  this.imageError = '';

  if (file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const maxSizeMB = 2;

    if (!validTypes.includes(file.type)) {
      this.imageError = 'Only JPG, PNG, or WEBP images are allowed.';
      fileInput.value = '';
      this.selectedFile = null;
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      this.imageError = 'Image size must be less than 2MB.';
      fileInput.value = '';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = file;
  }
}


  submit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    if (this.data.mode === 'add' && !this.selectedFile) {
      alert('Image is required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.itemForm.get('title')?.value);
    formData.append('description', this.itemForm.get('description')?.value);
    formData.append('location', this.itemForm.get('location')?.value);
    formData.append('type', this.itemForm.get('type')?.value);
    formData.append('status', this.itemForm.get('status')?.value);
    formData.append('user_id', this.itemForm.get('user_id')?.value);

    if (this.selectedFile) {
      formData.append('itemImage', this.selectedFile);
    }

    if (this.data.mode === 'add') {
      this.itemService.addItem(formData).subscribe(
        (createdItem) => this.dialogRef.close(createdItem),
        (error) => this.errorservice.handleError( error, 'ItemFormDialogComponent')
      );
    } else if (this.data.mode === 'edit') {
      const itemId = this.data.item?.id || '';
      this.itemService.updateItem(itemId, formData).subscribe(
        (updatedItem) => this.dialogRef.close(updatedItem),
        (error) => this.errorservice.handleError( error, 'ItemFormDialogComponent')
      );
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  openItemFormDialog(): void {
  this.dialog.open(ItemFormDialogComponent, {
    width: '400px',
    data: {}
  });
}
}
