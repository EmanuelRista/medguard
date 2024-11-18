import { Component, OnInit } from '@angular/core';  // Importa i decoratori di Angular
import { Chart, registerables } from 'chart.js';  // Importa Chart.js e i suoi componenti registrabili
import { PatientService } from './../../patient/patient.service';  // Importa il servizio per ottenere i pazienti

@Component({
  selector: 'app-patient-visit-chart',  // Selettore per il componente
  templateUrl: './patient-visit-chart.component.html',  // Template HTML
  styleUrls: ['./patient-visit-chart.component.scss']  // Stili CSS
})
export class PatientVisitChartComponent implements OnInit {
  patientsData: any[] = [];  // Array per memorizzare i dati dei pazienti
  diagnosisColors: any = {};  // Mappa delle diagnosi ai colori
  uniqueDiagnoses: string[] = [];  // Diagnosi uniche estratte dai dati

  constructor(private patientService: PatientService) { }

  // ngOnInit viene chiamato all'inizializzazione del componente
  ngOnInit(): void {
    Chart.register(...registerables);  // Registriamo tutti i componenti necessari di Chart.js

    // Ottieni i dati dai pazienti
    this.patientService.getPatients().subscribe((patients: any) => {
      const patientsArray = this.transformToArray(patients);  // Converte l'oggetto in array
      this.patientsData = patientsArray;
      this.extractUniqueDiagnoses();  // Estrai diagnosi uniche dai dati
      this.createGroupedBarChart();  // Crea il grafico a barre raggruppate
    });
  }

  // Funzione per trasformare l'oggetto dei pazienti in un array
  private transformToArray(patients: any): any[] {
    return Object.values(patients);  // Converte l'oggetto in un array dei valori
  }

  // Funzione per estrarre le diagnosi uniche dai dati dei pazienti
  private extractUniqueDiagnoses(): void {
    // Estrae tutte le diagnosi dai pazienti
    const diagnoses = this.patientsData.map(patient => patient.diagnosis);
    // Crea un array con diagnosi uniche
    this.uniqueDiagnoses = Array.from(new Set(diagnoses));  // Rimuove i duplicati

    // Assegna un colore casuale per ogni diagnosi
    this.uniqueDiagnoses.forEach((diagnosis, index) => {
      this.diagnosisColors[diagnosis] = this.generateRandomColor(index);  // Colore per ogni diagnosi
    });
  }

  // Funzione per generare un colore casuale in formato rgb
  private generateRandomColor(index: number): string {
    const r = Math.floor(255 * (index / this.uniqueDiagnoses.length));  // Calcola il componente rosso
    const g = Math.floor(255 * (1 - (index / this.uniqueDiagnoses.length)));  // Calcola il componente verde
    const b = Math.floor(255 * Math.random());  // Calcola il componente blu casualmente
    return `rgb(${r}, ${g}, ${b})`;  // Restituisce il colore in formato rgb
  }

  // Funzione per creare il grafico a barre raggruppate
  private createGroupedBarChart(): void {
    const ctx = <HTMLCanvasElement>document.getElementById('groupedBarChart');  // Ottieni il contesto del canvas

    // Calcola il numero di pazienti per ogni diagnosi
    const diagnosesData = this.uniqueDiagnoses.map(diagnosis => {
      const patientsWithDiagnosis = this.patientsData.filter(patient => patient.diagnosis === diagnosis);
      return {
        diagnosis: diagnosis,
        patientsCount: patientsWithDiagnosis.length  // Conta i pazienti con questa diagnosi
      };
    });

    // Configura i dati per il grafico
    const dataForChart = {
      labels: diagnosesData.map(data => data.diagnosis),  // Etichette (diagnosi)
      datasets: [{
        label: 'Numero di pazienti per diagnosi',  // Etichetta del dataset
        data: diagnosesData.map(data => data.patientsCount),  // Dati: numero di pazienti per diagnosi
        backgroundColor: diagnosesData.map(data => this.diagnosisColors[data.diagnosis]),  // Colore di sfondo per ogni barra
        borderColor: diagnosesData.map(data => this.diagnosisColors[data.diagnosis]),  // Colore del bordo della barra
        borderWidth: 1  // Larghezza del bordo
      }]
    };

    // Crea il grafico a barre
    new Chart(ctx, {
      type: 'bar',  // Tipo di grafico a barre
      data: dataForChart,  // Dati del grafico
      options: {
        responsive: true,  // Imposta il grafico come reattivo
        scales: {
          x: {
            title: {
              display: true,
              text: 'Diagnosi'  // Etichetta dell'asse X
            }
          },
          y: {
            beginAtZero: true,  // Inizia l'asse Y da 0
            title: {
              display: true,
              text: 'Numero di pazienti'  // Etichetta dell'asse Y
            },
            ticks: {
              stepSize: 1  // Imposta il passo dei tick a 1
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context: any) => {
                return `${context.raw} pazienti`;  // Tooltip che mostra il numero di pazienti
              }
            }
          }
        }
      }
    });
  }
}
