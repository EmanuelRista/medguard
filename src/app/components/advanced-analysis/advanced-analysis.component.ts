import { Component, OnInit } from '@angular/core';
import { SharedDataService } from './../../shared/shared-data.service';
import { Patient } from './../../patient/patient.model';

@Component({
  selector: 'app-advanced-analysis',
  templateUrl: './advanced-analysis.component.html',
  styleUrls: ['./advanced-analysis.component.scss']
})
export class AdvancedAnalysisComponent implements OnInit {

  patients: Patient[] = [];

  constructor(private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
    // Verifica se i pazienti sono già nel localStorage
    this.sharedDataService.patients$.subscribe((patients) => {
      if (patients.length === 0) {
        // Se non ci sono pazienti, simula una chiamata API per caricarli
        this.sharedDataService.fetchPatientsFromApi();  // Recupera i dati e li salva nel localStorage
      } else {
        // Altrimenti carica i dati dal localStorage
        this.patients = patients;
      }
    });
  }
}
