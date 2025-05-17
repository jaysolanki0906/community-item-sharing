import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserinfoComponent } from './userinfo/userinfo.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { SharedModule } from '../../shared/shared.module';
import { UserinformationRoutingModule } from './userinformation-routing.module';

@NgModule({
  declarations: [UserinfoComponent],
  imports: [
    CommonModule,
    CommonModule,
    MatCardModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    SharedModule,
    UserinformationRoutingModule
  ]
})
export class UserinformationModule { }
