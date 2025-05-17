import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyitemsComponent } from './myitems/myitems.component';

const routes: Routes = [
  { path: '', component: MyitemsComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemsRoutingModule { }
