import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistraUser {
  private readonly userRegistrerApi = 'http://localhost:8080/usuarios';

  constructor(private http: HttpClient) {}

  realizaCadastro(email: string, nome: string, senha: string, telefone: string): Observable<any> {
    return this.http.post(this.userRegistrerApi, { email, nome, senha, telefone });
  }
}
