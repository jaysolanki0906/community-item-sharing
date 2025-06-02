import { Component, inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../core/services/auth-service.service';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { RolePermissionService } from '../../core/services/role-permission.service';
import { UserService } from '../../core/services/user.service';
import { RoleService } from '../../core/services/role.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer!: MatSidenav;

  isAdmin: boolean = false;
  isSmallScreen = false;
  currentRole: string = 'USER';
  isDarkTheme = false;

  // Inject TranslateService using new inject() method
  translate: TranslateService = inject(TranslateService);

  private roleSub!: Subscription;
  private breakpointSub!: Subscription;

  constructor(
    private authService: AuthServiceService,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    public errorService: ErrorHandlerService,
    public rolePermissionService: RolePermissionService,
    public userService: UserService,
    public roleService: RoleService
  ) {
    // Initialize language from localStorage or default to 'en'
    const savedLang = localStorage.getItem('lang') || 'en';
    this.translate.setDefaultLang(savedLang);
    this.translate.use(savedLang);
  }

  ngOnInit(): void {
    // Log current role (for debug)
    this.roleService.logCurrentRole();

    // Load and apply theme from localStorage or system preference
    let storedTheme = localStorage.getItem('theme');
    if (!storedTheme) {
      storedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark-theme' : '';
    }
    this.isDarkTheme = storedTheme === 'dark-theme';
    document.body.classList.toggle('dark-theme', this.isDarkTheme);

    // Read role & auth_items from localStorage
    const storedRole = localStorage.getItem('user_role');
    const storedAuthItems = localStorage.getItem('user_auth_items');

    if (storedRole) {
      this.currentRole = storedRole.toUpperCase();
      this.isAdmin = this.currentRole === 'ADMIN';

      // Parse stored auth items if present, else use empty object
      const authItems = storedAuthItems ? JSON.parse(storedAuthItems) : {};

      // Initialize RolePermissionService with stored data
      this.rolePermissionService.setRole(this.currentRole, authItems);

      // Update RoleService with current role
      this.roleService.setRole(this.currentRole);
    }

    // Subscribe to role changes
    this.roleSub = this.roleService.role$.subscribe(role => {
      this.currentRole = (role || 'USER').toUpperCase();
      this.isAdmin = this.currentRole === 'ADMIN';
      this.rolePermissionService.setRole(this.currentRole);
    });

    // Subscribe to breakpoint observer for responsive UI
    this.breakpointSub = this.breakpointObserver
      .observe([Breakpoints.Handset, '(max-width: 960px)'])
      .pipe(
        map(result => result.matches),
        shareReplay()
      )
      .subscribe(isSmall => {
        this.isSmallScreen = isSmall;
      });
  }

  ngOnDestroy(): void {
    if (this.roleSub) this.roleSub.unsubscribe();
    if (this.breakpointSub) this.breakpointSub.unsubscribe();
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

  // Permission getters to control UI elements visibility

  get canShowItems(): boolean {
    return (
      this.rolePermissionService.getPermission('item', 'item_create') ||
      this.rolePermissionService.getPermission('item', 'item_update') ||
      this.rolePermissionService.getPermission('item', 'item_delete') ||
      this.rolePermissionService.getPermission('item', 'item_view')
    );
  }

  get canShowInterests(): boolean {
    return (
      this.rolePermissionService.getPermission('interest', 'interest_assign') ||
      this.rolePermissionService.getPermission('interest', 'interest_list')
    );
  }

  get canManageUsers(): boolean {
    return this.rolePermissionService.getPermission('user', 'user_status_update');
  }
}
