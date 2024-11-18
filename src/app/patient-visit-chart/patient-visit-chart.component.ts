import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { PatientService } from '../patient/patient.service'; // Importa il servizio

@Component({
  selector: 'app-patient-visit-chart',
  templateUrl: './patient-visit-chart.component.html',
  styleUrls: ['./patient-visit-chart.component.scss']
})
export class PatientVisitChartComponent implements OnInit {
  patientsData: any[] = [];
  diagnosisColors: any = {};  // Mappa delle diagnosi ai colori
  uniqueDiagnoses: string[] = [];  // Diagnosi uniche estratte dai dati

  constructor(private patientService: PatientService) { }

  ngOnInit(): void {
    Chart.register(...registerables);  // Registriamo i componenti necessari di Chart.js

    // Ottieni i dati dai pazienti
    this.patientService.getPatients().subscribe((patients: any) => {
      const patientsArray = this.transformToArray(patients);  // Converte l'oggetto in array
      this.patientsData = patientsArray;
      this.extractUniqueDiagnoses();  // Estrai diagnosi uniche dai dati
      this.createGroupedBarChart();  // Crea il grafico a barre raggruppate
    });
  }

  private transformToArray(patients: any): any[] {
    return Object.values(patients);  // Converte l'oggetto in un array dei valori
  }

  private extractUniqueDiagnoses(): void {
    const diagnoses = this.patientsData.map(patient => patient.diagnosis);
    this.uniqueDiagnoses = Array.from(new Set(diagnoses));  // Rimuovi duplicati

    this.uniqueDiagnoses.forEach((diagnosis, index) => {
      this.diagnosisColors[diagnosis] = this.generateRandomColor(index);  // Assegna un colore casuale per ogni diagnosi
    });
  }

  private generateRandomColor(index: number): string {
    const r = Math.floor(255 * (index / this.uniqueDiagnoses.length));
    const g = Math.floor(255 * (1 - (index / this.uniqueDiagnoses.length)));
    const b = Math.floor(255 * Math.random());
    return `rgb(${r}, ${g}, ${b})`;  // Usa rgb invece di rgba
  }

  // Crea il grafico a barre raggruppate
  private createGroupedBarChart(): void {
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

    new Chart(ctx, {
      type: 'bar',  // Tipo di grafico a barre
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
