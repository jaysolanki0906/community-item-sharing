import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TitleCasePipe } from '../../../shared/titlecase.pipe';

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
    @Inject(MAT_DIALOG_DATA) public data: { item: any, mode: 'add' | 'edit' | 'view' },
    private titleCasePipe: TitleCasePipe,
  ) {
    const tagsFromData = data.item?.tags || [];
    this.itemForm = this.fb.group({
      title: [data.item?.title || '', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: [data.item?.description || '', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      location: [data.item?.location || '', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      type: [data.item?.type || '', Validators.required],
      status: [data.item?.status || 'ACTIVE', Validators.required],
      category: [data.item?.category || ''],
      urgency: [data.item?.urgency || 'normal'],
      isFeatured: [!!data.item?.isFeatured],
      tags: this.fb.array(this.tagOptions.map(opt => tagsFromData.includes(opt.value))),
    });

    if (this.isViewMode) {
      this.itemForm.disable();
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

  get tags(): FormArray {
    return this.itemForm.get('tags') as FormArray;
  }

  get descriptionHtml(): string {
    return this.itemForm.get('description')?.value || '';
  }

  getSelectedTags(): string[] {
    return this.tags.controls
      .map((ctrl, i) => ctrl.value ? this.tagOptions[i].value : null)
      .filter((v): v is string => v !== null);
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
    const selectedTags = this.getSelectedTags();
    if (selectedTags.length > 0) formData.append('tags', JSON.stringify(selectedTags));
    if (this.selectedFile) formData.append('itemImage', this.selectedFile);

    this.dialogRef.close(formData); // Pass the FormData back to parent
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