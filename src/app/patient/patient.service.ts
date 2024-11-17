import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Patient } from './patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = environment.apiUrl;  // Sostituisci con l'URL della tua API Firebase

  constructor(private http: HttpClient) { }

  // Funzione per ottenere i pazienti da Firebase
  getPatients(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  addPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient); // Aggiungi un nuovo paziente
  }
}
