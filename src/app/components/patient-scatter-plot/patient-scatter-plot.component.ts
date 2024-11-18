import { Component, OnInit } from '@angular/core';  // Importa i decorator di Angular
import { ChartConfiguration } from 'chart.js';  // Importa la configurazione del grafico di Chart.js
import { Chart } from 'chart.js';  // Importa la classe per creare il grafico
import { PatientService } from './../../patient/patient.service';  // Importa il servizio per ottenere i pazienti
import { Patient } from './../../patient/patient.model';  // Importa il modello del paziente

@Component({
  selector: 'app-patient-scatter-plot',  // Selettore per il componente
  templateUrl: './patient-scatter-plot.component.html',  // Template HTML
  styleUrls: ['./patient-scatter-plot.component.scss']  // Stili CSS
})
export class PatientScatterPlotComponent implements OnInit {

  chart: any;  // Variabile per memorizzare il grafico
  patients: Patient[] = [];  // Array di pazienti
  diagnosisMap: { [key: string]: number } = {};  // Mappa dinamica delle diagnosi, per associare ogni diagnosi a un valore numerico

  constructor(private patientService: PatientService) { }

  // ngOnInit viene chiamato all'inizializzazione del componente
  ngOnInit(): void {
    this.getPatientsData();  // Recupera i dati dei pazienti quando il componente è pronto
  }

  // Funzione per recuperare i dati dei pazienti tramite il servizio
  getPatientsData() {
    this.patientService.getPatients().subscribe(
      (data) => {
        console.log(data);  // Log dei dati per vedere la struttura
        this.patients = data;  // Assegna i pazienti recuperati al nostro array
        this.createDiagnosisMap();  // Crea la mappa delle diagnosi
        this.createChart();  // Crea il grafico dopo aver ricevuto i dati
      },
      (error) => {
        console.error('Errore nel recuperare i pazienti:', error);  // Gestione degli errori
      }
    );
  }

  // Funzione per creare la mappa delle diagnosi
  createDiagnosisMap(): void {
    // Estrae le diagnosi uniche dal array dei pazienti
    const uniqueDiagnoses = new Set(this.patients.map(patient => patient.diagnosis));
    let yValue = 1;  // Inizializza il valore Y per la mappa

    uniqueDiagnoses.forEach(diagnosis => {
      this.diagnosisMap[diagnosis] = yValue++;  // Associa ogni diagnosi a un valore Y univoco
    });
  }

  // Funzione per creare il grafico a dispersione
  createChart(): void {
    // Mappa i dati dei pazienti per generare i punti del grafico
    const data = this.patients.map(patient => ({
      x: patient.age,  // L'età del paziente come valore X
      y: this.diagnosisMap[patient.diagnosis] || 0,  // La diagnosi mappata al valore Y, o 0 se non trovata
      patient: patient,  // Aggiungi il paziente ai dati per visualizzare il tooltip
    }));

    // Configurazione del grafico
    const chartConfig: ChartConfiguration = {
      type: 'scatter',  // Tipo di grafico (scatter plot)
      data: {
        datasets: [{
          label: 'Pazienti',  // Etichetta del dataset
          data: data,  // Dati da visualizzare nel grafico
          pointRadius: 8,  // Raggio dei punti del grafico
          // La gestione dei colori è automatica, lasciata a Chart.js
        }]
      },
      options: {
        responsive: true,  // Imposta il grafico come reattivo
        scales: {
          x: {
            title: {
              display: true,
              text: 'Età'  // Etichetta dell'asse X
            },
            min: 0  // Imposta il valore minimo dell'asse X a 0
          },
          y: {
            title: {
              display: true,
              text: 'Diagnosi'  // Etichetta dell'asse Y
            },
            ticks: {
              // Callback per visualizzare il nome della diagnosi invece del numero
              callback: (value) => {
                const diagnosis = Object.keys(this.diagnosisMap).find(diagnosis => this.diagnosisMap[diagnosis] === value);
                return diagnosis || '';  // Restituisce la diagnosi associata al valore Y
              }
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                // Aggiunge un tooltip per visualizzare il nome del paziente e la sua diagnosi
                const patient = (tooltipItem.raw as { patient: Patient }).patient;
                return `${patient.name}: ${patient.diagnosis}`;  // Mostra il nome e la diagnosi del paziente
              }
            }
          }
        }
      }
    };

    this.chart = new Chart('scatterChart', chartConfig);  // Crea il grafico utilizzando la configurazione
  }
}
