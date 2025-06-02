import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../../core/services/auth-service.service';
import { RolePermissionService } from '../../../core/services/role-permission.service';
import { UserService } from '../../../core/services/user.service';
import { RoleService } from '../../../core/services/role.service';
import { CommonModule } from '@angular/common';
import { TokenService } from '../../../core/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthServiceService,
    private rolePermissionService: RolePermissionService,
    private userService: UserService,
    private roleService: RoleService,
    private refreshtoken:TokenService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;
      this.authService.login(loginData).subscribe({
        next: (response: any) => {
          if (response.data && response.data.id) {
          } else {
            localStorage.removeItem('userId');
          }
          this.refreshtoken.saveTokens(response.access_token, response.refresh_token);

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
          console.error('Login error:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
        }
      });
    }
  }
}
