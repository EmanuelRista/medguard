import { Injectable } from '@angular/core';  // Importa il decoratore Injectable da Angular per dichiarare il servizio
import { HttpClient } from '@angular/common/http';  // Importa HttpClient per fare richieste HTTP
import { Observable } from 'rxjs';  // Importa Observable per gestire flussi asincroni
import { environment } from '../../environments/environment';  // Importa le variabili di ambiente (URL API)
import { Patient } from './patient.model';  // Importa il modello 'Patient' per tipizzare i pazienti
import { switchMap } from 'rxjs/operators';  // Importa l'operatore 'switchMap' per gestire flussi asincroni

// Decoratore che indica che questa classe è un servizio e deve essere iniettato nel root di Angular
@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = environment.apiUrl;  // L'URL dell'API Firebase, definito nelle variabili di ambiente

  // Il costruttore inietta HttpClient per fare richieste HTTP
  constructor(private http: HttpClient) { }

  // Funzione per ottenere la lista dei pazienti dal database (Firebase)
  getPatients(): Observable<any> {
    return this.http.get(this.apiUrl);  // Esegue una richiesta GET per ottenere i dati dei pazienti
  }

  // Funzione per aggiungere un nuovo paziente nel database
  addPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient);  // Esegue una richiesta POST per aggiungere un nuovo paziente
  }

  // Funzione per eliminare un paziente dal database, dato l'indice
  deletePatient(index: number): Observable<void> {
    return this.getPatients().pipe(  // Prima otteniamo i pazienti tramite la funzione getPatients()
      switchMap((patients: any) => {  // Utilizza 'switchMap' per operare sul risultato della richiesta
        const patientKey = Object.keys(patients)[index];  // Ottiene la chiave del paziente all'indice specificato
        // Esegue una richiesta DELETE per eliminare il paziente usando la chiave ottenuta
        return this.http.delete<void>(`https://medguard-e5ae7-default-rtdb.europe-west1.firebasedatabase.app/${patientKey}.json`);
      })
    );
  }

  // Funzione per aggiornare i dati di un paziente nel database
  updatePatient(patientKey: string, patient: Patient): Observable<Patient> {
    // Esegue una richiesta PUT per aggiornare i dati del paziente usando la chiave del paziente
    return this.http.put<Patient>(`https://medguard-e5ae7-default-rtdb.europe-west1.firebasedatabase.app/${patientKey}.json`, patient);
  }
}
