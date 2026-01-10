import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BuscarUserEmailService {
  private readonly apiUrl = 'http://localhost:8080/usuarios/dados_user_email';

  constructor(private http: HttpClient) {}

  buscaPorEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${email}`);
  }
}
