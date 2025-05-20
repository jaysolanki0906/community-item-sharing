import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-create-role-dialog',
  templateUrl: './create-role-dialog.component.html',
  styleUrl: './create-role-dialog.component.scss',
  standalone:false,
})
export class CreateRoleDialogComponent {
  roleTitle: string = '';

  constructor(
    public dialogRef: MatDialogRef<CreateRoleDialogComponent>
  ) {}

  onCreate(): void {
    if (this.roleTitle.trim()) {
      this.dialogRef.close(this.roleTitle.trim());
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
