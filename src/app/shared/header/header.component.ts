import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthServiceService } from '../../core/services/auth-service.service';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatSidenav, MatSidenavContainer, MatSidenavModule } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('drawer') drawer!: MatSidenav;  
  isAdmin: boolean = false;
  isSmallScreen = false;
  transalte:TranslateService=inject(TranslateService);
  constructor(private authService: AuthServiceService, private router: Router,private breakpointObserver:BreakpointObserver,private translate: TranslateService) 
  {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.translate.setDefaultLang(savedLang);
    this.translate.use(savedLang);
  }
  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang); 
  }

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.isAdmin = role === 'ADMIN';
    this.breakpointObserver
      .observe([Breakpoints.Handset, '(max-width: 960px)'])
      .pipe(
        map(result => result.matches),
        shareReplay()
      )
      .subscribe(isSmall => {
        this.isSmallScreen = isSmall;
      });
  }

  logout(): void {
    this.authService.logout();
    localStorage.clear();
    this.router.navigate(['/login']);
    console.log('User logged out successfully.');
  }
}
