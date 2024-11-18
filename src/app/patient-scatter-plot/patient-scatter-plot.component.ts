import { Component, OnInit } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { Chart } from 'chart.js';
import { PatientService } from './../patient/patient.service'; // Importa il servizio
import { Patient } from './../patient/patient.model'; // Importa il modello del paziente

@Component({
  selector: 'app-patient-scatter-plot',
  templateUrl: './patient-scatter-plot.component.html',
  styleUrls: ['./patient-scatter-plot.component.scss']
})
export class PatientScatterPlotComponent implements OnInit {

  chart: any;
  patients: Patient[] = []; // Array di pazienti
  diagnosisMap: { [key: string]: number } = {}; // Mappa dinamica delle diagnosi

  constructor(private patientService: PatientService) { }

  ngOnInit(): void {
    this.getPatientsData(); // Recupera i dati dei pazienti all'inizializzazione
  }

  // Funzione per recuperare i dati dei pazienti tramite il servizio
  getPatientsData() {
    this.patientService.getPatients().subscribe(
      (data) => {
        console.log(data); // Aggiungi questo log per vedere la struttura dei dati
        this.patients = data; // Assegna i dati dei pazienti
        this.createDiagnosisMap(); // Crea dinamicamente la mappa delle diagnosi
        this.createChart(); // Crea il grafico dopo aver ricevuto i dati
      },
      (error) => {
        console.error('Errore nel recuperare i pazienti:', error);
      }
    );
  }

  // Funzione per creare la mappa delle diagnosi
  createDiagnosisMap(): void {
    const uniqueDiagnoses = new Set(this.patients.map(patient => patient.diagnosis));  // Estrae diagnosi uniche
    let yValue = 1; // Iniziamo da 1 per il valore Y

    uniqueDiagnoses.forEach(diagnosis => {
      this.diagnosisMap[diagnosis] = yValue++;
    });
  }

  // Funzione per creare il grafico a dispersione
  createChart(): void {
    const data = this.patients.map(patient => ({
      x: patient.age,
      y: this.diagnosisMap[patient.diagnosis] || 0, // Ottieni il valore Y dalla mappa dinamica
      patient: patient,  // Aggiungi il paziente ai dati per il tooltip
    }));

    const chartConfig: ChartConfiguration = {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Pazienti',
          data: data,
          pointRadius: 8,
          // Lascia che Chart.js gestisca automaticamente i colori
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Età'
            },
            min: 0
          },
          y: {
            title: {
              display: true,
              text: 'Diagnosi'
            },
            ticks: {
              callback: (value) => {
                // Accesso alla mappa delle diagnosi direttamente nel callback
                const diagnosis = Object.keys(this.diagnosisMap).find(diagnosis => this.diagnosisMap[diagnosis] === value);
                return diagnosis || '';
              }
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const patient = (tooltipItem.raw as { patient: Patient }).patient;  // Cast del tipo
                return `${patient.name}: ${patient.diagnosis}`;
              }
            }
          }
        }
      }
    };

    this.chart = new Chart('scatterChart', chartConfig);
  }
}
