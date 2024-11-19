import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Patient } from './../../patient/patient.model';

Chart.register(...registerables);

@Component({
  selector: 'app-patient-scatter-plot',
  templateUrl: './patient-scatter-plot.component.html',
  styleUrls: ['./patient-scatter-plot.component.scss']
})
export class PatientScatterPlotComponent implements OnInit, OnChanges {

  @Input() patients: Patient[] = [];  // Accetta i pazienti come input
  chart: any;  // Variabile per il grafico
  diagnosisMap: { [key: string]: number } = {};  // Mappa delle diagnosi

  ngOnInit(): void {
    Chart.register(...registerables);  // Registra i componenti necessari di Chart.js
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['patients'] && this.patients.length > 0) {
      this.createDiagnosisMap();  // Aggiorna la mappa delle diagnosi
      this.createChart();  // Crea il grafico
    }
  }

  // Crea la mappa delle diagnosi
  private createDiagnosisMap(): void {
    const uniqueDiagnoses = new Set(this.patients.map(patient => patient.diagnosis));
    let yValue = 1;

    uniqueDiagnoses.forEach(diagnosis => {
      this.diagnosisMap[diagnosis] = yValue++;
    });
  }

  // Crea il grafico
  private createChart(): void {
    if (this.chart) {
      this.chart.destroy(); // Distrugge il grafico precedente per aggiornare i dati
    }

    const data = this.patients.map(patient => ({
      x: patient.age,
      y: this.diagnosisMap[patient.diagnosis] || 0,
      patient: patient,
    }));

    const chartConfig: ChartConfiguration = {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Pazienti',
          data: data,
          pointRadius: 8,
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
                const diagnosis = Object.keys(this.diagnosisMap).find(d => this.diagnosisMap[d] === value);
                return diagnosis || '';
              }
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const patient = (tooltipItem.raw as { patient: Patient }).patient;
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
