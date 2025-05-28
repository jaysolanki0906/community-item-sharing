import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './core/services/user.service';
import { RoleService } from './core/services/role.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(private translate: TranslateService,public userService: UserService, public roleService: RoleService) {
  translate.addLangs(['en', 'hi']);
  translate.setDefaultLang('en');

  const browserLang = translate.getBrowserLang() || 'en';
  translate.use(browserLang.match(/en|hi/) ? browserLang : 'en');
}
  ngOnInit() {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.roleService.setRole(user.role); 
      },
      error: () => {
        this.roleService.setRole('USER'); 
      }
    });
  }
  title = 'community-item-sharing';
  

}
