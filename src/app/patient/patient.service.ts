import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Patient } from './patient.model';
import { switchMap } from 'rxjs/operators';


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

  deletePatient(index: number): Observable<void> {
    return this.getPatients().pipe(
      // Una volta ottenuti i pazienti, usa l'indice per determinare il paziente da eliminare
      switchMap((patients: any) => {
        const patientKey = Object.keys(patients)[index]; // Ottieni la chiave del paziente all'indice
        return this.http.delete<void>(`https://medguard-e5ae7-default-rtdb.europe-west1.firebasedatabase.app/${patientKey}.json`); // Elimina il paziente usando la chiave
      })
    );
  }

  // Funzione per aggiornare i dati di un paziente
  updatePatient(patientKey: string, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`https://medguard-e5ae7-default-rtdb.europe-west1.firebasedatabase.app/${patientKey}.json`, patient);
  }


}
