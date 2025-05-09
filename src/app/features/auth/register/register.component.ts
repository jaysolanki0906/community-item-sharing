import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../../core/services/auth-service.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'], // Fixed typo: `styleUrl` -> `styleUrls`
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

  // Method to handle form submission
  onSubmit() {
    console.log("Register button clicked");
    this.submitted = true; // Mark the form as submitted

    // If the form is invalid, exit the function
    if (this.registerForm.invalid) {
      return;
    }

    // Extract form data
    const formData = this.registerForm.value;

    // Call the register method from the AuthServiceService
    this.authService.register(formData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response); // Log success response
        this.router.navigate(['/login']); // Navigate to the login page
      },
      error: (error) => {
        console.error('Registration failed:', error); // Log error response
        alert(`Error: ${error.message}`); // Display error message to the user
      },
    });
  }
}