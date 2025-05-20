import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsComponent } from './items/items.component';
import { InterestedUsersComponent } from './interested-users/interested-users.component';

const routes: Routes = [
  { path: '', component: ItemsComponent },
  { path: 'interested-users', component: InterestedUsersComponent },
  { path: '', redirectTo: 'items', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterestsRoutingModule { }
