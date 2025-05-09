import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HeaderComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  exports:[HeaderComponent,TitleCasePipe]
})
export class SharedModule { }
