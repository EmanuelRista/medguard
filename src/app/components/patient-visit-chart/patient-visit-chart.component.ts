import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Patient } from './../../patient/patient.model';

Chart.register(...registerables);

@Component({
  selector: 'app-patient-visit-chart',
  templateUrl: './patient-visit-chart.component.html',
  styleUrls: ['./patient-visit-chart.component.scss']
})
export class PatientVisitChartComponent implements OnInit, OnChanges {

  @Input() patients: Patient[] = [];  // Dati dei pazienti ricevuti tramite input
  patientsData: Patient[] = [];  // Array per memorizzare i dati dei pazienti
  diagnosisColors: { [key: string]: string } = {};  // Mappa delle diagnosi ai colori
  uniqueDiagnoses: string[] = [];  // Diagnosi uniche estratte dai dati
  chart: any;  // Variabile per memorizzare il grafico

  constructor() {}

  ngOnInit(): void {
    Chart.register(...registerables);  // Registra i componenti necessari di Chart.js
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patients'] && this.patients.length > 0) {
      this.patientsData = this.patients;  // Aggiorna i dati locali dei pazienti
      this.extractUniqueDiagnoses();  // Estrai diagnosi uniche dai dati
      this.createGroupedBarChart();  // Crea il grafico a barre raggruppate
    }
  }

  // Funzione per estrarre le diagnosi uniche dai dati dei pazienti
  private extractUniqueDiagnoses(): void {
    const diagnoses = this.patientsData.map(patient => patient.diagnosis);
    this.uniqueDiagnoses = Array.from(new Set(diagnoses));  // Rimuove i duplicati

    // Assegna un colore casuale per ogni diagnosi
    this.uniqueDiagnoses.forEach((diagnosis, index) => {
      this.diagnosisColors[diagnosis] = this.generateRandomColor(index);
    });
  }

  // Funzione per generare un colore casuale in formato rgb
  private generateRandomColor(index: number): string {
    const r = Math.floor(255 * (index / this.uniqueDiagnoses.length));
    const g = Math.floor(255 * (1 - (index / this.uniqueDiagnoses.length)));
    const b = Math.floor(255 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Funzione per creare il grafico a barre raggruppate
  private createGroupedBarChart(): void {
    if (this.chart) {
      this.chart.destroy(); // Distruggi il grafico precedente per evitare duplicazioni
    }

    const ctx = <HTMLCanvasElement>document.getElementById('groupedBarChart');
    const diagnosesData = this.uniqueDiagnoses.map(diagnosis => {
      const patientsWithDiagnosis = this.patientsData.filter(patient => patient.diagnosis === diagnosis);
      return {
        diagnosis: diagnosis,
        patientsCount: patientsWithDiagnosis.length
      };
    });

    const dataForChart = {
      labels: diagnosesData.map(data => data.diagnosis),
      datasets: [{
        label: 'Numero di pazienti per diagnosi',
        data: diagnosesData.map(data => data.patientsCount),
        backgroundColor: diagnosesData.map(data => this.diagnosisColors[data.diagnosis]),
        borderColor: diagnosesData.map(data => this.diagnosisColors[data.diagnosis]),
        borderWidth: 1
      }]
    };

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: dataForChart,
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Diagnosi'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Numero di pazienti'
            },
            ticks: {
              stepSize: 1
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context: any) => {
                return `${context.raw} pazienti`;
              }
            }
          }
        }
      }
    });
  }
}
