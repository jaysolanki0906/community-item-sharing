import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../../core/services/auth-service.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'], 
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthServiceService
  ) {
    // Initialize the registration form with name, email, and password fields
    this.registerForm = this.fb.group({
      name: ['', [Validators.required]], // Name field is required
      email: ['', [Validators.required, Validators.email]], // Email field is required and must be a valid email
      password: ['', [Validators.required, Validators.minLength(6)]], // Password field is required and must have at least 6 characters
    });
  }

  onSubmit() {
    console.log("Register button clicked");
    this.submitted = true; 
    if (this.registerForm.invalid) {
      return;
    }
    const formData = this.registerForm.value;
    this.authService.register(formData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response); 
        this.router.navigate(['/login']); 
      },
      error: (error) => {
        console.error('Registration failed:', error); 
        alert(`Error: ${error.message}`); 
      },
    });
  }
}