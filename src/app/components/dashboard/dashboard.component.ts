import { Component, OnInit } from '@angular/core';
import { PatientService } from './../../patient/patient.service';
import { SharedDataService } from './../../shared/shared-data.service'; // Importa il servizio condiviso
import { Patient } from './../../patient/patient.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  patients: Patient[] = [];

  constructor(
    private patientService: PatientService,
    private sharedDataService: SharedDataService // Inietta il servizio condiviso
  ) {}

  message = '';

  onNotify(message: string) {
    this.message = message; // Salva il messaggio ricevuto dal figlio
  }

  ngOnInit(): void {
    this.patientService.getPatients().subscribe((patients) => {
      this.patients = patients; // Aggiorna i pazienti nel componente
      this.sharedDataService.setPatients(this.patients); // Aggiorna i dati nel servizio condiviso
    });
  }
}
