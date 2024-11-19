import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Patient } from './../patient/patient.model';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  private patientsSubject: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>(this.loadPatientsFromStorage());
  patients$ = this.patientsSubject.asObservable();

  constructor() {}

  // Carica i pazienti dal localStorage
  private loadPatientsFromStorage(): Patient[] {
    const patientsData = localStorage.getItem('patients');
    return patientsData ? JSON.parse(patientsData) : [];  // Se non ci sono pazienti, restituisci un array vuoto
  }

  // Salva i pazienti nel localStorage
  setPatients(patients: Patient[]): void {
    localStorage.setItem('patients', JSON.stringify(patients));  // Salva i dati nel localStorage
    this.patientsSubject.next(patients);  // Notifica i componenti osservatori
  }

  // Metodo per simulare la chiamata API (per esempio)
  fetchPatientsFromApi(): void {
    // Simula una chiamata API e salva i dati nel localStorage
    const patientsFromApi: Patient[] = [ /* Dati simulati */ ];
    this.setPatients(patientsFromApi);  // Salva i dati nel localStorage
  }
}
