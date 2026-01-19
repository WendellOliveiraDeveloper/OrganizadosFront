import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { PaginaPrincipal } from './pages/pagina-principal/pagina-principal';
import { PaginaRegistro } from './pages/pagina-registro/pagina-registro';
import { PaginaTarefas } from './pages/pagina-tarefas/pagina-tarefas';
import { LoginGuard } from './guards/login-guard';
import { AuthGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
    canActivate: [LoginGuard],
  },
  {
    path: 'register',
    component: PaginaRegistro,
  },
  {
    path: 'home',
    component: PaginaPrincipal,
    canActivate: [AuthGuard],
  },
  {
    path: 'tarefas',
    component: PaginaTarefas,
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
