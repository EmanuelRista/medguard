import { Component, OnInit } from '@angular/core';  // Importa il decoratore Component e OnInit da Angular
import { Chart, registerables } from 'chart.js';  // Importa Chart.js e i moduli necessari per i grafici
import { PatientService } from './../../patient/patient.service'; // Importa il servizio per ottenere i dati dei pazienti

// Decoratore Component che definisce il componente, il suo selector, template e stile
@Component({
  selector: 'app-age-chart',  // Il tag HTML del componente
  templateUrl: './age-chart.component.html',  // Il template associato al componente
  styleUrls: ['./age-chart.component.scss']  // Il foglio di stile associato al componente
})
export class AgeChartComponent implements OnInit {
  // Definisci le fasce di età da visualizzare nel grafico
  ageGroups = ['0-18', '19-35', '36-50', '51-70', '71+'];
  patientsCount: number[] = [0, 0, 0, 0, 0];  // Array per conteggiare il numero di pazienti per ciascuna fascia di età

  constructor(private patientService: PatientService) { }  // Inietta il servizio PatientService per ottenere i dati dei pazienti

  // Metodo che viene eseguito al momento dell'inizializzazione del componente
  ngOnInit(): void {
    Chart.register(...registerables);  // Registra i componenti necessari di Chart.js

    // Ottieni i dati dei pazienti dal servizio
    this.patientService.getPatients().subscribe((patients: any) => {
      const patientsArray = this.transformToArray(patients);  // Converte l'oggetto dei pazienti in un array
      this.calculateAgeGroups(patientsArray);  // Calcola la distribuzione dei pazienti nelle fasce di età
      this.createChart();  // Crea il grafico con i dati calcolati
    });
  }

  // Funzione per trasformare la risposta di Firebase (un oggetto) in un array
  private transformToArray(patients: any): any[] {
    return Object.values(patients);  // Converte l'oggetto in un array dei valori (pazienti)
  }

  // Funzione per calcolare la distribuzione dei pazienti nelle fasce di età
  private calculateAgeGroups(patients: any[]): void {
    this.patientsCount = [0, 0, 0, 0, 0];  // Reset del contatore per le fasce di età

    // Cicla attraverso tutti i pazienti per contarli in base alla loro fascia di età
    patients.forEach(patient => {
      const age = patient.age;  // Estrae l'età del paziente
      if (age <= 18) {
        this.patientsCount[0]++;  // Incrementa il contatore della fascia '0-18'
      } else if (age <= 35) {
        this.patientsCount[1]++;  // Incrementa il contatore della fascia '19-35'
      } else if (age <= 50) {
        this.patientsCount[2]++;  // Incrementa il contatore della fascia '36-50'
      } else if (age <= 70) {
        this.patientsCount[3]++;  // Incrementa il contatore della fascia '51-70'
      } else {
        this.patientsCount[4]++;  // Incrementa il contatore della fascia '71+'
      }
    });
  }

  // Funzione per creare il grafico utilizzando Chart.js
  private createChart(): void {
    const ctx = <HTMLCanvasElement>document.getElementById('ageChart');  // Seleziona l'elemento canvas dal DOM
    new Chart(ctx, {
      type: 'bar',  // Tipo di grafico (barra)
      data: {
        labels: this.ageGroups,  // Etichette per l'asse X (fasce di età)
        datasets: [{
          label: 'Numero di pazienti',  // Etichetta della serie di dati
          data: this.patientsCount,  // I dati da visualizzare nel grafico (conteggio dei pazienti per fascia di età)
          backgroundColor: '#42A5F5',  // Colore di riempimento delle barre
          borderColor: '#1E88E5',  // Colore del bordo delle barre
          borderWidth: 1  // Larghezza del bordo delle barre
        }]
      },
      options: {
        responsive: true,  // Il grafico è reattivo (si adatta alla larghezza della finestra)
        scales: {
          y: {
            beginAtZero: true,  // Imposta l'asse Y per iniziare da 0
            ticks: {
              stepSize: 1,  // Imposta l'intervallo tra i tick sull'asse Y
              precision: 0  // Rimuove la parte decimale dai valori sull'asse Y
            }
          }
        }
      }
    });
  }

}
