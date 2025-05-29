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
import { MatMenuModule } from '@angular/material/menu';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';



@NgModule({
  declarations: [HeaderComponent,ImageDialogComponent,Tabledesign2Component],
  imports: [
    CommonModule,
    HttpClientModule,
  MatToolbarModule,
  MatSortModule,
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
  MatFormFieldModule,
  FormsModule,
  MatPaginatorModule,
  MatMenuModule,
  TranslateModule,
    MatInputModule,
    MatSelectModule,
  ],
  exports:[HeaderComponent,
    TitleCasePipe,
    HeaderComponent,
    ImageDialogComponent,
    Tabledesign2Component,
    TranslateModule]
})
export class SharedModule { }
