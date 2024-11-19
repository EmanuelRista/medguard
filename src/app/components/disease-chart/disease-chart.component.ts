import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Patient } from './../../patient/patient.model';

Chart.register(...registerables);

@Component({
  selector: 'app-disease-chart',
  templateUrl: './disease-chart.component.html',
  styleUrls: ['./disease-chart.component.scss']
})
export class DiseaseChartComponent implements OnInit, OnChanges {

  @Input() patients: Patient[] = [];  // Dichiara l'input per ricevere i pazienti
  chart: any;  // Variabile per memorizzare il grafico
  diagnosisCounts: { [key: string]: number } = {};  // Oggetto per i conteggi delle diagnosi

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patients'] && this.patients.length > 0) {
      this.aggregateDiagnoses();  // Aggrega le diagnosi
      this.createPieChart();  // Crea il grafico
    }
  }

  ngOnInit(): void {
    // Puoi fare altre inizializzazioni qui, ma il recupero dei dati lo faremo in ngOnChanges
  }

  // Funzione per aggregare le diagnosi dei pazienti
  aggregateDiagnoses() {
    this.diagnosisCounts = {};  // Resetta il conteggio delle diagnosi

    // Itera su ogni paziente per aggregare le diagnosi
    this.patients.forEach((patient: Patient) => {
      const diagnosis = patient.diagnosis;  // Ottieni la diagnosi del paziente
      if (this.diagnosisCounts[diagnosis]) {
        this.diagnosisCounts[diagnosis]++;  // Incrementa il conteggio della diagnosi
      } else {
        this.diagnosisCounts[diagnosis] = 1;  // Inizializza il conteggio per una nuova diagnosi
      }
    });
  }

  // Funzione per creare il grafico a torta usando Chart.js
  createPieChart() {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;  // Ottieni il riferimento al canvas
    const labels = Object.keys(this.diagnosisCounts);  // Le etichette del grafico
    const data = Object.values(this.diagnosisCounts);  // I dati per il grafico

    // Crea il grafico a torta
    new Chart(ctx, {
      type: 'pie',  // Tipo di grafico (torta)
      data: {
        labels: labels,  // Le etichette del grafico
        datasets: [{
          label: 'Distribuzione Diagnosi',  // Etichetta per il dataset
          data: data,  // I dati delle diagnosi
          backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#ff9f40', '#4caf50']  // Colori per ogni parte della torta
        }]
      },
      options: {
        responsive: true  // Rende il grafico reattivo
      }
    });
  }
}
