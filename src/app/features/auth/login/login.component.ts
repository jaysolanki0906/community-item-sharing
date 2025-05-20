import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../../core/services/auth-service.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm:FormGroup;
  submitted = false;
  constructor(private fb:FormBuilder,private http: HttpClient,private router: Router,private authService: AuthServiceService )
  {
    this.loginForm=this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(3)]],
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.authService.login(loginData).subscribe({
        next: (response: any) => {
          console.log('Login successful:', response);
          localStorage.setItem('token', response.access_token);
          localStorage.setItem('role', response.data.role);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
  console.error('Login failed:', error);
  alert('Invalid credentials. Please try again.');
  localStorage.removeItem('token'); 
}

      });
    }
  }
}
