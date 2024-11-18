import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

// Componenti dell'app
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PatientListComponent } from './patient-list/patient-list.component';
import { AgeChartComponent } from './age-chart/age-chart.component';

// Moduli Angular Material
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';

// Modulo per i form reattivi
import { ReactiveFormsModule } from '@angular/forms'

// Environment e Firebase

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';


import { HttpClientModule } from '@angular/common/http';
import { DiseaseChartComponent } from './disease-chart/disease-chart.component';
import { CarouselComponent } from './carousel/carousel.component';
import { PatientScatterPlotComponent } from './patient-scatter-plot/patient-scatter-plot.component';
import { AdvancedAnalysisComponent } from './advanced-analysis/advanced-analysis.component';
import { PatientVisitChartComponent } from './patient-visit-chart/patient-visit-chart.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PatientListComponent,
    AgeChartComponent,
    DiseaseChartComponent,
    CarouselComponent,
    PatientScatterPlotComponent,
    AdvancedAnalysisComponent,
    PatientVisitChartComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: 'dashboard', component: DashboardComponent },
      { path: 'patient-list', component: PatientListComponent },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard/advanced-analysis', component: AdvancedAnalysisComponent }
    ]),
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
    ReactiveFormsModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    HttpClientModule,
    MatPaginatorModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
