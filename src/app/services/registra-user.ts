import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment_dev';
import { timeout, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RegistraUser {
  private readonly userRegistrerApi = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  realizaCadastro(email: string, nome: string, senha: string, telefone?: string): Observable<any> {
    const body = {
      email,
      nome,
      senha,
      telefone: telefone || null,
    };

    return this.http
      .post(this.userRegistrerApi, body, {
        headers: {
          'Content-Type': 'application/json',
        },
        observe: 'body',
      })
      .pipe(
        timeout(10000),
        catchError((error) => {
          if (error.name === 'TimeoutError') {
            return throwError(() => new Error('Timeout: Servidor não respondeu a tempo'));
          }
          return throwError(() => error);
        })
      );
  }
}
