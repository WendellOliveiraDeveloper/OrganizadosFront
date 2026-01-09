import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { PaginaPrincipal } from './modules/pagina-principal/pagina-principal';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: '',
    component: PaginaPrincipal,
  },
];
