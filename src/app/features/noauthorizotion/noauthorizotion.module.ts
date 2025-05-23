import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoauthComponent } from './noauth/noauth.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from '../../shared/header/header.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', component: NoauthComponent }
];

@NgModule({
  declarations: [NoauthComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports:[NoauthComponent,RouterModule]
})
export class NoauthorizotionModule { }
