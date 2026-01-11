import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnviaFormularioService } from '../../services/envia-formulario';
import { Router } from '@angular/router';
import { Modal } from '../modal/modal';
import { BuscarUserEmailService } from '../../services/buscar-user-email';
import { UserStorageService } from '../../services/user-storage-service';
import { LoadingComponent } from '../loading-component/loading-component';
import { finalize, switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal, LoadingComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  user: any = null;
  email!: string;
  senha!: string;
  modalAberto: boolean = false;
  erroMensagem!: string;
  isLoadingModal: boolean = false;

  constructor(
    private enviaLoginRequest: EnviaFormularioService,
    private router: Router,
    private buscarPorEmail: BuscarUserEmailService,
    private cdr: ChangeDetectorRef,
    private userStorage: UserStorageService
  ) {}

  registrarUser() {
    this.router.navigate(['/register']);
  }

  enviar() {
    this.isLoadingModal = true;
    this.erroMensagem = '';

    this.enviaLoginRequest
      .realizaLogin(this.email, this.senha)
      .pipe(
        switchMap(() => {
          this.userStorage.limpar();
          return this.buscarPorEmail.buscaPorEmail(this.email);
        }),
        finalize(() => {
          this.isLoadingModal = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.user = res;
          this.userStorage.salvar(res);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          this.modalAberto = true;

          if (err.status === 404 || err.status === 401) {
            this.erroMensagem =
              err?.error?.mensagem || err?.error?.message || 'Erro ao realizar login';
          } else {
            this.erroMensagem = 'Erro inesperado ao realizar login';
          }
        },
      });
  }
}
