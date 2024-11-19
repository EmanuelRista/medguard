import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Patient } from './../../patient/patient.model';  // Importa il modello del paziente

Chart.register(...registerables);  // Registra i moduli necessari di Chart.js

@Component({
  selector: 'app-age-chart',
  templateUrl: './age-chart.component.html',
  styleUrls: ['./age-chart.component.scss']
})
export class AgeChartComponent implements OnInit, OnChanges {

  @Input() patients: Patient[] = [];  // Dati dei pazienti passati tramite Input
  ageGroups = ['0-18', '19-35', '36-50', '51-70', '71+'];  // Fasce di età
  patientsCount: number[] = [0, 0, 0, 0, 0];  // Conteggio dei pazienti per ciascuna fascia

  // Chiamato quando il componente è inizializzato
  ngOnInit(): void {
    // Chart.js è registrato all'inizio
    Chart.register(...registerables);
  }

  // Chiamato quando i dati passati tramite @Input() cambiano
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patients'] && this.patients.length > 0) {
      this.calculateAgeGroups();  // Ricalcola le fasce di età quando i pazienti cambiano
      this.createChart();  // Rendi di nuovo il grafico
    }
  }

  // Funzione per calcolare la distribuzione dei pazienti nelle fasce di età
  private calculateAgeGroups(): void {
    this.patientsCount = [0, 0, 0, 0, 0];  // Reset del conteggio per le fasce di età

    // Cicla attraverso i pazienti per contare in quale fascia di età si trovano
    this.patients.forEach(patient => {
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

  // Funzione per creare il grafico a barre
  private createChart(): void {
    const ctx = <HTMLCanvasElement>document.getElementById('ageChart');  // Seleziona l'elemento canvas dal DOM

    new Chart(ctx, {
      type: 'bar',  // Tipo di grafico (barre)
      data: {
        labels: this.ageGroups,  // Etichette per l'asse X (fasce di età)
        datasets: [{
          label: 'Numero di pazienti',  // Etichetta della serie
          data: this.patientsCount,  // Dati da visualizzare (conteggio pazienti)
          backgroundColor: '#42A5F5',  // Colore di riempimento delle barre
          borderColor: '#1E88E5',  // Colore del bordo delle barre
          borderWidth: 1  // Larghezza del bordo
        }]
      },
      options: {
        responsive: true,  // Rende il grafico reattivo
        scales: {
          y: {
            beginAtZero: true,  // L'asse Y inizia da 0
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
