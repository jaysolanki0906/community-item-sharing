import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from './notfound/notfound.component';
import { WildcardComponent } from './wildcard/wildcard.component';

const routes: Routes = [
  {path: '', component:WildcardComponent }, 
  { path: 'not-found', component: NotfoundComponent },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    WildcardComponent,
    NotfoundComponent,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule,NotfoundComponent, WildcardComponent]
})
export class NotfoundModule {}
