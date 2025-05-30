import { Component } from '@angular/core';

@Component({
  selector: 'app-notfound',
  standalone: true,
  template: `
    <div style="text-align:center; margin-top: 100px;">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  `
})
export class NotfoundComponent {}
