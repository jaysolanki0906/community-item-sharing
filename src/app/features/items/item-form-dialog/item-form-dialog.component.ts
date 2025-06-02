import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TitleCasePipe } from '../../../shared/titlecase.pipe';
import { MapDialogComponent } from '../map-dialog/map-dialog.component';

@Component({
  selector: 'app-item-form-dialog',
  templateUrl: './item-form-dialog.component.html',
  standalone: false,
  styleUrls: ['./item-form-dialog.component.scss'],
})
export class ItemFormDialogComponent {
  itemForm: FormGroup;
  imageError: string = '';
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;

  categoryOptions = [
    { label: 'Electronics', value: 'electronics' },
    { label: 'Books', value: 'books' },
    { label: 'Clothing', value: 'clothing' }
  ];

  radioOptions = [
    { label: 'Urgent', value: 'urgent' },
    { label: 'Normal', value: 'normal' }
  ];

  tagOptions = [
    { label: 'New', value: 'new' },
    { label: 'Used', value: 'used' },
    { label: 'Gift', value: 'gift' }
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ItemFormDialogComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { item: any, mode: 'add' | 'edit' | 'view' },
    private titleCasePipe: TitleCasePipe,
  ) {
    const tagsFromData: string[] = Array.isArray(data.item?.tags) ? data.item.tags : [];

    let locationString = '';
    if (typeof data.item?.location === 'string') {
      locationString = data.item.location;
    } else if (data.item?.location && typeof data.item.location === 'object' && 'x' in data.item.location && 'y' in data.item.location) {
      locationString = `${data.item.location.y},${data.item.location.x}`;
    }

    this.itemForm = this.fb.group({
      title: [data.item?.title || '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: [data.item?.description || '', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      location: [locationString, [Validators.required]],
      type: [data.item?.type || '', Validators.required],
      status: [data.item?.status || 'ACTIVE', Validators.required],
      category: [data.item?.category || ''],
      urgency: [data.item?.urgency || 'normal'],
      isFeatured: [!!data.item?.isFeatured],
      tags: [tagsFromData], 
    });

    if (this.isViewMode) {
      this.itemForm.disable();
    } else {
      this.itemForm.enable();
    }

    if (data.item?.imageUrl) {
      this.imagePreviewUrl = data.item.imageUrl;
    }
  }

  get isViewMode(): boolean {
    return this.data.mode === 'view';
  }

  get modeTitle(): string {
    return this.titleCasePipe.transform(this.data.mode) + ' Item';
  }

  get descriptionHtml(): string {
    return this.itemForm.get('description')?.value || '';
  }

  onFileChange(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    this.imageError = '';
    this.imagePreviewUrl = null;

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

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  openMapDialog(): void {
    let lat: number | null = null;
    let lng: number | null = null;
    // Parse current value if present
    const locValue = this.itemForm.get('location')?.value;
    if (locValue && typeof locValue === 'string' && locValue.includes(',')) {
      const parts = locValue.split(',').map(Number);
      if (!isNaN(parts[0]) && !isNaN(parts[1])) {
        lat = parts[0];
        lng = parts[1];
      }
    }
    const dialogRef = this.dialog.open(MapDialogComponent, {
      width: '700px',
      data: { lat, lng }
    });

    dialogRef.afterClosed().subscribe((result) => {
      // result is now a string like "lat,lng"
      if (typeof result === 'string' && result.includes(',')) {
        this.itemForm.patchValue({ location: result });
      }
    });
  }

  submit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const rawValue = this.itemForm.getRawValue();
    const formData = new FormData();

    formData.append('title', rawValue.title);
    formData.append('description', rawValue.description);

    formData.append('location', rawValue.location);

    formData.append('type', rawValue.type);
    formData.append('status', rawValue.status);
    if (rawValue.category) formData.append('category', rawValue.category);
    if (rawValue.urgency) formData.append('urgency', rawValue.urgency);
    if (rawValue.isFeatured) formData.append('isFeatured', rawValue.isFeatured.toString());
    if (rawValue.tags && rawValue.tags.length > 0) {
      formData.append('tags', JSON.stringify(rawValue.tags));
    }
    if (this.selectedFile) formData.append('itemImage', this.selectedFile);

    this.dialogRef.close(formData); 
  }

  cancel(): void {
    this.dialogRef.close();
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    this.imageError = '';
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }
}