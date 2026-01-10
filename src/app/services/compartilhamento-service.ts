import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CompartilhamentoService {
  private emailSource = new BehaviorSubject<string | null>(null);
  email$ = this.emailSource.asObservable();

  setEmail(email: string) {
    this.emailSource.next(email);
  }

  getEmail(): string | null {
    return this.emailSource.value;
  }
}
