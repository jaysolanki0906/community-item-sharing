import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'community-item-sharing';
  constructor(private translate: TranslateService) {
  translate.addLangs(['en', 'hi']);
  translate.setDefaultLang('en');

  const browserLang = translate.getBrowserLang() || 'en';
  translate.use(browserLang.match(/en|hi/) ? browserLang : 'en');
}

}
