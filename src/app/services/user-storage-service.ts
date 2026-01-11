import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserStorageService {
  private readonly KEY = 'user_logado';

  salvar(user: any) {
    localStorage.setItem(this.KEY, JSON.stringify(user));
  }

  buscar() {
    const data = localStorage.getItem(this.KEY);
    return data ? JSON.parse(data) : null;
  }

  limpar() {
    localStorage.removeItem(this.KEY);
  }
}
