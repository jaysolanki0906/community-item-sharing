import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { User } from '../../../../core/models/user.model';
import { CommonModule } from '@angular/common';
import { ListusersComponent } from '../listusers/listusers.component';
import { MatInput } from '@angular/material/input';
import { ApiServiceService } from '../../../../core/services/api-service.service';

@Component({
  selector: 'app-userform',
  standalone:false,
  templateUrl: './userform.component.html',
  styleUrl: './userform.component.scss'
})
export class UserformComponent implements OnInit {
  userForm!: FormGroup;
  mode!: string;

  constructor(
    private fb: FormBuilder,
    private api: ApiServiceService,  // Injecting the ApiService
    public dialogRef: MatDialogRef<UserformComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.mode = this.data.mode;
    
    // Initialize the form group
    this.userForm = this.fb.group({
      id: [{ value: this.data.item.id, disabled: this.mode === 'view' }, Validators.required],
      name: [{ value: this.data.item.name, disabled: this.mode === 'view' }, Validators.required],
      email: [{ value: this.data.item.email, disabled: this.mode === 'view' }, [Validators.required, Validators.email]],
      role: [{ value: this.data.item.role, disabled: this.mode === 'view' }, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const updatedData = this.userForm.value;
      const userId = updatedData.id;

      this.updateUser(userId, updatedData).subscribe(
        response => {
          console.log('User updated successfully', response);
          this.dialogRef.close(true);
        },
        error => {
          console.error('Error updating user', error);
        }
      );
    }
  }

  closeForm(): void {
    this.dialogRef.close(false);
  }

  updateUser(id: string, data: any) {
    return this.api.patch(`users/${id}`, data);
  }
}