import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../core/services/auth-service.service';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { RolePermissionService } from '../../core/services/role-permission.service';
import { UserService } from '../../core/services/user.service';
import { RoleService } from '../../core/services/role.service';

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
  currentRole: string = 'USER';
  isDarkTheme = false;
  transalte: TranslateService = inject(TranslateService);

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    public translate: TranslateService,
    private errorservice: ErrorHandlerService,
    public rolePermissionService: RolePermissionService,
    public userService: UserService,
    public roleService: RoleService
  ) {
    const savedLang = localStorage.getItem('lang') || 'en';
    this.translate.setDefaultLang(savedLang);
    this.translate.use(savedLang);
  }

  ngOnInit(): void {
    let storedTheme = localStorage.getItem('theme');
    if (!storedTheme) {
      storedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-theme' : '';
    }
    this.isDarkTheme = storedTheme === 'dark-theme';
    document.body.classList.toggle('dark-theme', this.isDarkTheme);

    this.roleService.role$.subscribe(role => {
      this.currentRole = (role || 'USER').toUpperCase();
      this.isAdmin = this.currentRole === 'ADMIN';
      this.rolePermissionService.setRole(this.currentRole);
    });

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

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme', this.isDarkTheme);
    localStorage.setItem('theme', this.isDarkTheme ? 'dark-theme' : '');
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('lang', lang); 
  }

  logout(): void {
    this.authService.logout();
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  get canShowItems(): boolean {
    return (
      this.rolePermissionService.getPermission('items', 'items_create') ||
      this.rolePermissionService.getPermission('items', 'items_edit') ||
      this.rolePermissionService.getPermission('items', 'items_delete') ||
      this.rolePermissionService.getPermission('items', 'items_view')
    );
  }

  get canShowInterests(): boolean {
    return (
      this.rolePermissionService.getPermission('items', 'mark_interest') ||
      this.rolePermissionService.getPermission('items', 'view_interest')
    );
  }

  get canManageUsers(): boolean {
    return this.rolePermissionService.getPermission('manage-user', 'users_manage');
  }
}