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
  displayedColumns: string[] = ['id', 'name', 'age', 'diagnosis', 'lastVisit', 'actions'];
  dataSource = new MatTableDataSource<Patient>();
  patientForm!: FormGroup; // Dichiarazione del form
  patients: Patient[] = []; // Aggiungiamo un array per conservare i pazienti
  editingPatientId: number | null = null;

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
    if (this.editingPatientId !== null) {
      // Aggiorna il paziente esistente
      this.updatePatient();
    } else {
      // Aggiungi un nuovo paziente
      const newPatient: Patient = {
        id: this.getNextId(),
        ...this.patientForm.value
      };

      this.patientService.addPatient(newPatient).subscribe(
        () => {
          this.patients.push(newPatient);
          this.dataSource.data = [...this.patients];
          this.patientForm.reset();
        },
        (error) => {
          console.error('Errore nell\'aggiungere il paziente:', error);
        }
      );
    }
  }
}


// Metodo per eliminare un paziente in base all'indice
deletePatient(index: number): void {
  // Ottieni l'ID del paziente in base all'indice
  const patientToDelete = this.patients[index];
  if (!patientToDelete) return;  // Se non esiste il paziente, esci

  // Rimuovi il paziente dall'array locale
  this.patients = this.patients.filter((_, i) => i !== index);

  // Aggiorna la tabella con i nuovi dati
  this.dataSource.data = [...this.patients];

  // Chiamata al servizio per eliminare il paziente nel backend
  this.patientService.deletePatient(index).subscribe(
    () => {
      console.log(`Paziente con indice ${index} eliminato con successo.`);
    },
    (error) => {
      console.error('Errore nell\'eliminare il paziente:', error);
    }
  );
}

// Metodo per selezionare un paziente da modificare e popolare il form
onEditPatient(patient: Patient): void {
  this.editingPatientId = patient.id;
  this.patientForm.patchValue({
    name: patient.name,
    age: patient.age,
    diagnosis: patient.diagnosis,
    lastVisit: patient.lastVisit,
  });
}

// Metodo per aggiornare il paziente
updatePatient(): void {

  if (this.patientForm.valid && this.editingPatientId !== null) {
    const updatedPatient: Patient = {
      id: this.editingPatientId,
      ...this.patientForm.value
    };

    this.patientService.updatePatient(updatedPatient.id.toString(), updatedPatient).subscribe(
      () => {
        const index = this.patients.findIndex(p => p.id === updatedPatient.id);
        if (index !== -1) {
          this.patients[index] = updatedPatient; // Aggiorna il paziente nell'array
          this.dataSource.data = [...this.patients]; // Rendi visibile l'aggiornamento nella tabella
        }

        // Reset del form e annullamento dell'editing
        this.patientForm.reset();
        this.editingPatientId = null;
      },
      (error) => {
        console.error('Errore nell\'aggiornare il paziente:', error);
      }
    );
  }
}


 // Funzione per ottenere il prossimo ID
getNextId(): number {
  const lastPatient = this.patients[this.patients.length - 1];
  console.log(lastPatient);  // Per verificare se l'ultimo paziente è corretto
  return lastPatient ? lastPatient.id + 1 : 1;
}

}
