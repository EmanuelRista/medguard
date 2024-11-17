import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PatientService } from './../patient/patient.service';
import { Patient } from './../patient/patient.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'; // Aggiungiamo FormBuilder e Validators

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'age', 'diagnosis', 'lastVisit'];
  dataSource = new MatTableDataSource<Patient>();
  patientForm!: FormGroup; // Dichiarazione del form
  patients: Patient[] = []; // Aggiungiamo un array per conservare i pazienti

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private patientService: PatientService,
    private fb: FormBuilder // Iniettiamo FormBuilder
  ) {}

  ngOnInit(): void {
    this.patientService.getPatients().subscribe(
      (data: { [key: string]: Patient }) => {
        const patientsArray: Patient[] = Object.values(data);
        this.patients = patientsArray; // Salviamo i pazienti nell'array
        this.dataSource.data = this.patients;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Errore nel recuperare i pazienti:', error);
      }
    );

    // Inizializzazione del form
    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      diagnosis: ['', Validators.required],
      lastVisit: ['', Validators.required],
    });
  }

  // Metodo per aggiungere un paziente
  addPatient(): void {
    if (this.patientForm.valid) {
      const newPatient: Patient = {
        id: this.getNextId(),
        ...this.patientForm.value
      };

      this.patientService.addPatient(newPatient).subscribe(
        () => {
          // Aggiungi il nuovo paziente alla lista
          this.patients.push(newPatient);
          this.dataSource.data = [...this.patients]; // Aggiorna la tabella

          // Reset del form solo dopo aver aggiornato la tabella
          this.patientForm.reset();
        },
        (error) => {
          console.error('Errore nell\'aggiungere il paziente:', error);
        }
      );
    }
  }



  // Funzione per ottenere il prossimo ID
  getNextId(): number {
    const lastPatient = this.patients[this.patients.length - 1];
    return lastPatient ? lastPatient.id + 1 : 1;
  }
}
