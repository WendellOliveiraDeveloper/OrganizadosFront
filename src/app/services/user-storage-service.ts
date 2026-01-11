import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserStorageService {
  private readonly KEY = 'user_logado';

  salvar(user: any) {
    if (!user) return;
    localStorage.setItem(this.KEY, JSON.stringify(user));
  }

  buscar() {
    const value = localStorage.getItem(this.KEY);

    if (!value || value === 'undefined') {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  limpar() {
    localStorage.removeItem(this.KEY);
  }
}
