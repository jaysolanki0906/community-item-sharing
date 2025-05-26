import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wildcard',
  template: '', // no visible HTML
})
export class WildcardComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      console.log('WildcardComponent initialized, redirecting to /not-found');
      this.router.navigateByUrl('/not-found', { skipLocationChange: true });
    });
  }
}
