import { Component, OnInit, ViewChild } from '@angular/core';  // Importa i decorator da Angular
import { MatTableDataSource } from '@angular/material/table';  // Importa MatTableDataSource per gestire la tabella
import { MatPaginator } from '@angular/material/paginator';  // Importa MatPaginator per la paginazione della tabella
import { MatSort } from '@angular/material/sort';  // Importa MatSort per la gestione dell'ordinamento della tabella
import { PatientService } from './../../patient/patient.service';  // Importa il servizio per ottenere i pazienti
import { Patient } from './../../patient/patient.model';  // Importa l'interfaccia Patient
import { FormGroup, FormBuilder, Validators } from '@angular/forms';  // Importa le classi per il form (FormGroup, FormBuilder, Validators)

@Component({
  selector: 'app-patient-list',  // Selettore per il componente
  templateUrl: './patient-list.component.html',  // Template HTML
  styleUrls: ['./patient-list.component.scss']  // Stili CSS
})
export class PatientListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'age', 'diagnosis', 'lastVisit', 'actions'];  // Colonne da visualizzare nella tabella
  dataSource = new MatTableDataSource<Patient>();  // Dati da visualizzare nella tabella, inizialmente vuoti
  patientForm!: FormGroup;  // Dichiarazione del form per aggiungere o modificare un paziente
  patients: Patient[] = [];  // Array per conservare i pazienti
  editingPatientId: number | null = null;  // Variabile per tenere traccia del paziente che stiamo modificando

  @ViewChild(MatPaginator) paginator!: MatPaginator;  // Riferimento al paginator per la paginazione della tabella
  @ViewChild(MatSort) sort!: MatSort;  // Riferimento al sort per ordinare i dati della tabella

  constructor(
    private patientService: PatientService,  // Servizio per gestire i pazienti
    private fb: FormBuilder  // FormBuilder per creare il form
  ) {}

  // ngOnInit viene chiamato all'inizializzazione del componente
  ngOnInit(): void {
    this.patientService.getPatients().subscribe(
      (data: { [key: string]: Patient }) => {
        const patientsArray: Patient[] = Object.values(data);  // Trasforma l'oggetto dei pazienti in un array
        this.patients = patientsArray;  // Salva i pazienti nell'array
        this.dataSource.data = this.patients;  // Assegna i pazienti alla dataSource della tabella
        this.dataSource.paginator = this.paginator;  // Imposta il paginator nella tabella
        this.dataSource.sort = this.sort;  // Imposta l'ordinamento nella tabella
      },
      (error) => {
        console.error('Errore nel recuperare i pazienti:', error);  // Gestione degli errori
      }
    );

    // Inizializzazione del form
    this.patientForm = this.fb.group({
      name: ['', Validators.required],  // Campo obbligatorio per il nome del paziente
      age: ['', [Validators.required, Validators.min(1)]],  // Campo obbligatorio per l'età, deve essere maggiore di 0
      diagnosis: ['', Validators.required],  // Campo obbligatorio per la diagnosi
      lastVisit: ['', Validators.required],  // Campo obbligatorio per la data dell'ultima visita
    });
  }

  // Metodo per aggiungere un paziente
  addPatient(): void {
    if (this.patientForm.valid) {  // Verifica che il form sia valido
      if (this.editingPatientId !== null) {  // Se stiamo modificando un paziente esistente
        this.updatePatient();  // Chiama il metodo per aggiornare il paziente
      } else {
        const newPatient: Patient = {  // Crea un nuovo paziente con i dati del form
          id: this.getNextId(),  // Ottieni il prossimo ID disponibile
          ...this.patientForm.value  // Aggiungi i valori del form al nuovo paziente
        };

        // Chiamata al servizio per aggiungere il paziente nel backend
        this.patientService.addPatient(newPatient).subscribe(
          () => {
            this.patients.push(newPatient);  // Aggiungi il nuovo paziente all'array
            this.dataSource.data = [...this.patients];  // Aggiorna i dati della tabella
            window.location.reload();  // Ricarica la pagina per aggiornare la visualizzazione
          },
          (error) => {
            console.error('Errore nell\'aggiungere il paziente:', error);  // Gestione degli errori
          }
        );
      }
    }
  }

  // Metodo per eliminare un paziente in base all'indice
  deletePatient(index: number): void {
    const patientToDelete = this.patients[index];  // Ottieni il paziente in base all'indice
    if (!patientToDelete) return;  // Se il paziente non esiste, esci dalla funzione

    this.patients = this.patients.filter((_, i) => i !== index);  // Rimuovi il paziente dall'array
    this.dataSource.data = [...this.patients];  // Aggiorna i dati della tabella

    // Chiamata al servizio per eliminare il paziente nel backend
    this.patientService.deletePatient(index).subscribe(
      () => {
        console.log(`Paziente con indice ${index} eliminato con successo.`);  // Log di successo
      },
      (error) => {
        console.error('Errore nell\'eliminare il paziente:', error);  // Gestione degli errori
      }
    );
  }

  // Metodo per selezionare un paziente da modificare e popolare il form
  onEditPatient(patient: Patient, index: number): void {
    this.deletePatient(index);  // Elimina il paziente prima di modificarlo
    this.editingPatientId = patient.id;  // Salva l'ID del paziente che stiamo modificando
    this.patientForm.patchValue({  // Popola il form con i dati del paziente
      name: patient.name,
      age: patient.age,
      diagnosis: patient.diagnosis,
      lastVisit: patient.lastVisit,
    });
  }

  // Metodo per aggiornare un paziente
  updatePatient(): void {
    if (this.patientForm.valid && this.editingPatientId !== null) {  // Verifica che il form sia valido e che ci sia un paziente da aggiornare
      const updatedPatient: Patient = {
        id: this.editingPatientId,  // Usa l'ID del paziente che stiamo modificando
        ...this.patientForm.value  // Aggiungi i valori del form al paziente esistente
      };

      // Chiamata al servizio per aggiornare il paziente nel backend
      this.patientService.updatePatient(updatedPatient.id.toString(), updatedPatient).subscribe(
        () => {
          const index = this.patients.findIndex(p => p.id === updatedPatient.id);  // Trova il paziente nell'array
          if (index !== -1) {
            this.patients[index] = updatedPatient;  // Aggiorna il paziente nell'array
            this.dataSource.data = [...this.patients];  // Aggiorna i dati della tabella
          }

          // Ricarica i pazienti dal backend dopo l'aggiornamento
          this.patientService.getPatients().subscribe(
            (data: { [key: string]: Patient }) => {
              const patientsArray: Patient[] = Object.values(data);  // Trasforma i dati in un array
              this.patients = patientsArray;  // Aggiorna l'array dei pazienti
              this.dataSource.data = this.patients;  // Rendi visibile l'aggiornamento nella tabella
            },
            (error) => {
              console.error('Errore nel recuperare i pazienti dopo l\'aggiornamento:', error);  // Gestione degli errori
            }
          );

          this.editingPatientId = null;  // Resetta l'ID del paziente che stavamo modificando
          window.location.reload();  // Ricarica la pagina per aggiornare la visualizzazione
        },
        (error) => {
          console.error('Errore nell\'aggiornare il paziente:', error);  // Gestione degli errori
        }
      );
    }
  }

  // Funzione per ottenere il prossimo ID
  getNextId(): number {
    const lastPatient = this.patients[this.patients.length - 1];  // Ottieni l'ultimo paziente
    return lastPatient ? lastPatient.id + 1 : 1;  // Restituisce l'ID successivo
  }
}
