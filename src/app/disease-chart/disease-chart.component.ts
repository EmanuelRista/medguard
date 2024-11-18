import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { PatientService } from './../patient/patient.service'; // Importa il servizio

Chart.register(...registerables);

// Usa l'interfaccia Patient che hai fornito
import { Patient } from './../patient/patient.model';

@Component({
  selector: 'app-disease-chart',
  templateUrl: './disease-chart.component.html',
  styleUrls: ['./disease-chart.component.scss']
})
export class DiseaseChartComponent implements OnInit {
  chart: any;
  diagnosisCounts: { [key: string]: number } = {};

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.getDiagnosisData();
  }

  // Funzione per recuperare i dati delle diagnosi
  getDiagnosisData() {
    this.patientService.getPatients().subscribe(
      (data) => {
        console.log(data); // Aggiungi questo log per vedere la struttura dei dati
        this.aggregateDiagnoses(data);  // Passa i dati alla funzione di aggregazione
        this.createPieChart();
      },
      (error) => {
        console.error('Errore nel recuperare i pazienti:', error);
      }
    );
  }

  // Funzione per aggregare le diagnosi
  aggregateDiagnoses(patients: { [key: string]: Patient }) {
    this.diagnosisCounts = {};

    // Trasforma l'oggetto in un array di pazienti
    const patientsArray: Patient[] = Object.values(patients);

    patientsArray.forEach((patient: Patient) => {
      const diagnosis = patient.diagnosis;
      if (this.diagnosisCounts[diagnosis]) {
        this.diagnosisCounts[diagnosis]++;
      } else {
        this.diagnosisCounts[diagnosis] = 1;
      }
    });
  }

  // Funzione per creare il grafico a torta
  createPieChart() {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    const labels = Object.keys(this.diagnosisCounts);
    const data = Object.values(this.diagnosisCounts);

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          label: 'Distribuzione Diagnosi',
          data: data,
          backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#ff9f40', '#4caf50']
        }]
      },
      options: {
        responsive: true
      }
    });
  }
}
