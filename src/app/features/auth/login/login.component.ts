import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../../core/services/auth-service.service';
import { RolePermissionService } from '../../../core/services/role-permission.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { LoginResponse } from '../../../core/models/login-response.model';
import { UserService } from '../../../core/services/user.service';
import { RoleService } from '../../../core/services/role.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false,
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthServiceService,
    private rolePermissionService: RolePermissionService,
    private errorHandler: ErrorHandlerService,
    private userService: UserService,
    private roleService: RoleService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.authService.login(loginData).subscribe({
        next: (response: LoginResponse) => {
          if (response.data && response.data.id) {
            localStorage.setItem('token', response.access_token);
          } else {
            localStorage.removeItem('userId');
          }
          localStorage.setItem('token', response.access_token);

          this.userService.fetchAndStoreCurrentUser().subscribe({
            next: (user) => {
              this.roleService.setRole(user.role); 
              this.rolePermissionService.setRole(user.role, user.auth_items); 
              this.router.navigate(['/dashboard']);
            },
            error: () => {
              this.roleService.setRole('USER');
              this.rolePermissionService.setRole('USER', {}); 
              this.router.navigate(['/dashboard']);
            }
          });
        },
        error: (error: any) => {
          this.errorHandler.handleLoginError(error, 'LoginComponent');
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
        }
      });
    }
  }
}