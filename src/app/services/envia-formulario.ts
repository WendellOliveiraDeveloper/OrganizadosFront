import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnviaFormularioService {

  private readonly apiUrl = 'http://localhost:8080/auth/login';

  constructor(private http: HttpClient) {}

  realizaLogin(email: string, senha: string): Observable<any> {
    return this.http.post(this.apiUrl, { email, senha });
  }
}
