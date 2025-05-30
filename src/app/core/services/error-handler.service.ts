import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  
  constructor(private snackBar: MatSnackBar,private authService:AuthServiceService) {}

  handleError(error: any, context: string = ''): void {
    let message = 'An unexpected error occurred. Please try again.';
    if (error instanceof HttpErrorResponse) {
      if (error.error && typeof error.error === 'object') {
        message = error.error.message || message;
      } else if (typeof error.error === 'string') {
        message = error.error;
      } else {
        message = error.message || message;
      }
    }
    if(message === 'Account deactivated') {
      this.handleLoginError(null, 'Account deactivated');
      localStorage.setItem('isActive', 'false');
      this.authService.logout();
    }

    this.snackBar.open(
      message,
      'Dismiss',
      {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: ['error-snackbar']
      }
    );
  }

  handleLoginError(error: any, context: string = ''): void {
    let message = 'Login failed. Please try again.';
    let icon: 'error' | 'warning' | 'info' | 'success' = 'error';
    let tit = 'Login Error';

    if (error === null && context) {
    tit='';
    message = context;
    icon = 'success';
  }

    if (error instanceof HttpErrorResponse) {
      if (error.error && typeof error.error === 'object') {
        message = error.error.message || message;
      } else if (typeof error.error === 'string') {
        message = error.error;
      } else {
        message = error.message || message;
      }

      if (error.status === 401) {
        message = 'Invalid credentials. Please check your username and password.';
        icon = 'warning';
      } else if (error.status === 403) {
        message = 'Access denied. You do not have permission to access this resource.';
        icon = 'error';
      } else if (error.status >= 500) {
        message = 'Server error. Please try again later.';
        icon = 'error';
      }
    }

    Swal.fire({
      title: tit,
      text: message,
      icon: icon,
      toast: false,
      timer: 3500,
      showConfirmButton: false,
      position: 'center',
      customClass: {
        popup: 'swal2-soft-alert'
      }
    });
  }
}
