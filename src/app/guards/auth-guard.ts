import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserStorageService } from '../services/user-storage-service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private userStorage: UserStorageService) {}

  canActivate(): boolean {
    const user = this.userStorage.buscar();

    if (user) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
