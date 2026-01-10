import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { PaginaPrincipal } from './pages/pagina-principal/pagina-principal';
import { PaginaRegistro } from './pages/pagina-registro/pagina-registro';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: PaginaRegistro,
  },
  {
    path: 'home',
    component: PaginaPrincipal,
  },
];
