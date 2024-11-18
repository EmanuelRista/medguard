import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { PatientService } from '../patient/patient.service'; // Importa il servizio

@Component({
  selector: 'app-age-chart',
  templateUrl: './age-chart.component.html',
  styleUrls: ['./age-chart.component.scss']
})
export class AgeChartComponent implements OnInit {
  // Definisci i dati da visualizzare
  ageGroups = ['0-18', '19-35', '36-50', '51-70', '71+'];
  patientsCount: number[] = [0, 0, 0, 0, 0]; // Inizializza il contatore delle fasce di età

  constructor(private patientService: PatientService) { }

  ngOnInit(): void {
    Chart.register(...registerables);  // Registriamo i componenti necessari di Chart.js

    // Ottieni i dati dai pazienti
    this.patientService.getPatients().subscribe((patients: any) => {
      const patientsArray = this.transformToArray(patients);  // Converte l'oggetto in array
      this.calculateAgeGroups(patientsArray);  // Calcola le fasce di età
      this.createChart();  // Crea il grafico
    });
  }

  // Funzione per trasformare la risposta di Firebase (oggetto) in un array
  private transformToArray(patients: any): any[] {
    return Object.values(patients);  // Converte l'oggetto in un array dei valori
  }

  // Calcola la distribuzione per le fasce di età
  private calculateAgeGroups(patients: any[]): void {
    // Reset dei contatori
    this.patientsCount = [0, 0, 0, 0, 0];

    // Calcola i contatori per le fasce di età
    patients.forEach(patient => {
      const age = patient.age;
      if (age <= 18) {
        this.patientsCount[0]++;
      } else if (age <= 35) {
        this.patientsCount[1]++;
      } else if (age <= 50) {
        this.patientsCount[2]++;
      } else if (age <= 70) {
        this.patientsCount[3]++;
      } else {
        this.patientsCount[4]++;
      }
    });
  }

  // Crea il grafico
  private createChart(): void {
    const ctx = <HTMLCanvasElement>document.getElementById('ageChart'); // Selezioniamo l'elemento canvas
    new Chart(ctx, {
      type: 'bar',  // Tipo di grafico (barra)
      data: {
        labels: this.ageGroups,  // Etichette (fasce di età)
        datasets: [{
          label: 'Numero di pazienti',
          data: this.patientsCount,  // Dati dei pazienti
          backgroundColor: '#42A5F5',  // Colore delle barre
          borderColor: '#1E88E5',  // Colore del bordo delle barre
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,  // Impostiamo l'asse Y per iniziare da zero
            ticks: {
              stepSize: 1,  // Imposta il passo per i tick a 1, mostrando solo numeri interi
              precision: 0  // Rimuove la parte decimale
            }
          }
        }
      }
    });
  }

}
