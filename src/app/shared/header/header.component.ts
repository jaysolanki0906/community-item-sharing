import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../core/services/auth-service.service';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

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
  constructor(private authService: AuthServiceService,
     private router: Router,
     private breakpointObserver:BreakpointObserver,
     private translate: TranslateService,private errorservice:ErrorHandlerService) {
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
    this.errorservice.handleError("User logged out successfully.",'ItemFormDialogComponent')
  }
}
