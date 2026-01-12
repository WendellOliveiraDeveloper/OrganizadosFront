import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnviaFormularioService {
  private readonly apiKeyUrl = `${environment.apiUrl}/auth/login`;

  constructor(private http: HttpClient) {}

  realizaLogin(email: string, senha: string) {
    return this.http.post(this.apiKeyUrl, { email, senha }).pipe(
      catchError((err) => {
        let mensagem = 'Erro ao realizar login';

        if (err.status === 401 || err.status === 404) {
          mensagem = err?.error?.message ?? mensagem;
        }

        return throwError(() => ({
          status: err.status,
          message: mensagem,
        }));
      })
    );
  }
}
