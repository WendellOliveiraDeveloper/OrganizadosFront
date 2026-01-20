import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserServices {
  private readonly apiUrlKey = `${environment.apiUrl}/usuarios`;

  public constructor(private http: HttpClient) {}

  public atualizarUser(userId: number, userNewData: any): Observable<any> {
    return this.http.put(`${this.apiUrlKey}/atualizar_user/${userId}`, userNewData).pipe(
      catchError((err) => {
        let mensagemErro = 'Erro ao atualizar seus dados!';

        if (err.status === 401 || err.status === 404) {
          mensagemErro = err?.error?.message ?? mensagemErro;
        }

        return throwError(() => ({
          status: err.status,
          mensagemErro,
        }));
      }),
    );
  }

  public atualizarSenhaUser(userId: number, novaSenha: any): Observable<any> {
    return this.http.put(`${this.apiUrlKey}/atualizar_senha/${userId}`, novaSenha).pipe(
      catchError((err) => {
        let mensagemErro = 'Erro ao atualizar sua senha!';

        if (err.status === 401 || err.status === 404) {
          mensagemErro = err?.error?.message ?? mensagemErro;
        }

        return throwError(() => ({
          status: err.status,
          mensagemErro,
        }));
      }),
    );
  }
}
