import { Component, OnInit } from '@angular/core';  // Importa i decorator da Angular
import { Chart, registerables } from 'chart.js';  // Importa Chart.js e i suoi componenti
import { PatientService } from './../../patient/patient.service';  // Importa il servizio per ottenere i dati dei pazienti

Chart.register(...registerables);  // Registra i componenti necessari di Chart.js

// Importa l'interfaccia Patient che rappresenta i pazienti
import { Patient } from './../../patient/patient.model';

@Component({
  selector: 'app-disease-chart',  // Definisce il selettore del componente (tag HTML)
  templateUrl: './disease-chart.component.html',  // Il template HTML associato
  styleUrls: ['./disease-chart.component.scss']  // Il foglio di stile associato
})
export class DiseaseChartComponent implements OnInit {
  chart: any;  // Variabile per memorizzare il grafico (se necessario)
  diagnosisCounts: { [key: string]: number } = {};  // Oggetto per tenere traccia del numero di pazienti per ogni diagnosi

  constructor(private patientService: PatientService) {}  // Inietta il servizio PatientService

  // ngOnInit viene chiamato quando il componente viene inizializzato
  ngOnInit() {
    this.getDiagnosisData();  // Richiama la funzione per ottenere i dati delle diagnosi
  }

  // Funzione per recuperare i dati delle diagnosi dai pazienti
  getDiagnosisData() {
    // Usa il servizio PatientService per ottenere i dati dei pazienti
    this.patientService.getPatients().subscribe(
      (data) => {
        console.log(data);  // Logga i dati per verificare la struttura (utile per il debug)
        this.aggregateDiagnoses(data);  // Aggrega le diagnosi
        this.createPieChart();  // Crea il grafico a torta
      },
      (error) => {
        console.error('Errore nel recuperare i pazienti:', error);  // Gestione degli errori
      }
    );
  }

  // Funzione per aggregare le diagnosi dei pazienti
  aggregateDiagnoses(patients: { [key: string]: Patient }) {
    this.diagnosisCounts = {};  // Resetta i conteggi delle diagnosi

    // Trasforma l'oggetto in un array di pazienti
    const patientsArray: Patient[] = Object.values(patients);

    // Itera su ogni paziente per conteggiare le diagnosi
    patientsArray.forEach((patient: Patient) => {
      const diagnosis = patient.diagnosis;  // Ottieni la diagnosi del paziente
      if (this.diagnosisCounts[diagnosis]) {
        this.diagnosisCounts[diagnosis]++;  // Incrementa il contatore della diagnosi
      } else {
        this.diagnosisCounts[diagnosis] = 1;  // Inizializza il contatore se è la prima volta che appare questa diagnosi
      }
    });
  }

  // Funzione per creare il grafico a torta usando Chart.js
  createPieChart() {
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;  // Ottieni il riferimento al canvas nel template
    const labels = Object.keys(this.diagnosisCounts);  // Le etichette del grafico sono le diagnosi
    const data = Object.values(this.diagnosisCounts);  // I dati sono i conteggi delle diagnosi

    // Crea un nuovo grafico a torta
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
        responsive: true  // Rende il grafico reattivo (adatta la dimensione al contenitore)
      }
    });
  }
}
