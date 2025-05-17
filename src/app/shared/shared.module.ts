import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { LayoutModule } from '@angular/cdk/layout';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { Tabledesign2Component } from './tabledesign2/tabledesign2.component';



@NgModule({
  declarations: [HeaderComponent,ImageDialogComponent,Tabledesign2Component],
  imports: [
    CommonModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  RouterModule,
  MatSidenavModule,
  LayoutModule,
  MatDialogModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatTableModule,
  FormsModule,
  MatPaginatorModule,
  ],
  exports:[HeaderComponent,
    TitleCasePipe,
    HeaderComponent,
    ImageDialogComponent,
    Tabledesign2Component]
})
export class SharedModule { }
