import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const HttpInspectorService: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const token = localStorage.getItem('token');
  const router = inject(Router);

  if (token && req.url.includes('/auth/login')) {
    router.navigate(['/dashboard']);
    return new Observable<HttpEvent<any>>();
  }

  const cloned = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      })
    : req;

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 404) {
        router.navigate(['/notfound']);
      }
      return throwError(() => error);
    })
  );
};
