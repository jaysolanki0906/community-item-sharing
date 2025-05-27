import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../../core/services/auth-service.service';
import { RolePermissionService } from '../../../core/services/role-permission.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { LoginResponse } from '../../../core/models/login-response.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  
  loginForm:FormGroup;
  submitted = false;
  constructor(private fb:FormBuilder,
    private router: Router,
    private authService: AuthServiceService ,
    private rolePermissionService:RolePermissionService,
    private errorHandler:ErrorHandlerService)
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
        next: (response: LoginResponse) => {
          console.log('Login successful:', response);
          localStorage.setItem('token', response.access_token);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
  this.errorHandler.handleLoginError(error, 'LoginComponent');
  localStorage.removeItem('token'); 
}
      });
    }
  }
}
