import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ItemsComponent } from './items/items.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { InterestedUsersComponent } from './interested-users/interested-users.component';
import { InterestsRoutingModule } from './interests-routing.module';


@NgModule({
  declarations: [ItemsComponent,InterestedUsersComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    SharedModule,
    InterestsRoutingModule
  ],
})
export class InterestsModule { }
