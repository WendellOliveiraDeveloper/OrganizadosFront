import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnviaFormularioService } from '../../services/envia-formulario';
import { Router } from '@angular/router';
import { Modal } from '../modal/modal';
import { BuscarUserEmailService } from '../../services/buscar-user-email';
import { UserStorageService } from '../../services/user-storage-service';
import { LoadingComponent } from '../loading-component/loading-component';
import { finalize, switchMap, timeout } from 'rxjs';

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
  modalSucesso: boolean = false;
  sucessoMensagem!: string;
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
    this.erroMensagem = '';
    this.isLoadingModal = true;

    if (!this.email || !this.senha) {
      this.erroMensagem = 'Preencha todos os campos obrigatórios';
      this.modalAberto = true;
      this.isLoadingModal = false;
      return;
    }

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
          this.sucessoMensagem = `Usuário logado! bem vindo ${this.user?.nome}`;
          this.modalSucesso = true;

          this.cdr.detectChanges();

          setTimeout(() => {
            this.modalSucesso = false;
            this.router.navigate(['/home']);
          }, 5000);
        },
        error: (err) => {
          this.modalAberto = true;
          this.erroMensagem = err.message;
        },
      });
  }
}

//   next: () => {
//     this.isLoadingModal = false;
//     this.mensagemSucesso = `O usuário ${this.nome} foi registrado com sucesso!`;
//     this.modalSucessoAberto = true;

//     setTimeout(() => {
//       this.modalSucessoAberto = false;
//       this.router.navigate(['/login']);
//     }, 1500);
//   },
//   error: (err: HttpErrorResponse) => {
//     this.isLoadingModal = false;

//     if (err.status === 0) {
//       this.erroMensagem =
//         'Erro de conexão com o servidor. Verifique se o está tudo certo com o servidor.';
//       this.modalErroAberto = true;
//     } else if (err.status) {
//       this.erroMensagem =
//         err.error?.message ||
//         err.error?.mensagem ||
//         err.message ||
//         `Erro ${err.status} ao registrar`;
//       this.modalErroAberto = true;
//     } else {
//       this.erroMensagem = 'Erro desconhecido ao tentar registrar.';
//       this.modalErroAberto = true;
//     }
//   },
//   complete: () => {
//     this.isLoadingModal = false;
//   },
// });
