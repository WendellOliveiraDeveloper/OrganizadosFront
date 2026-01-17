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
import { LabelComponent } from '../label-component/label-component';
import { TasksStoreService } from '../../services/tasks/tasks-store-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal, LoadingComponent, LabelComponent],
  templateUrl: './login.html',
  styleUrl: './login.scss',
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
    private userStorage: UserStorageService,
    private taskStorage: TasksStoreService
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
          }, 2000);
        },
        error: (err) => {
          this.modalAberto = true;
          this.erroMensagem = err.message;
        },
      });
  }
}
