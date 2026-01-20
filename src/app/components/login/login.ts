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
import { MatTooltipModule } from '@angular/material/tooltip';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { UserServices } from '../../services/user/user-services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Modal,
    LoadingComponent,
    MatTooltipModule,
    LabelComponent,
    FaIconComponent,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  user: any = null;
  userIdPassword!: number;
  email!: string;
  senha!: string;
  novaSenha!: string;
  modalAberto: boolean = false;
  modalSucesso: boolean = false;
  isModalEsqueciSenha: boolean = false;
  sucessoMensagem!: string;
  erroMensagem!: string;
  isLoadingModal: boolean = false;
  mostrarSenha: boolean = false;
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(
    private enviaLoginRequest: EnviaFormularioService,
    private router: Router,
    private buscarPorEmail: BuscarUserEmailService,
    private cdr: ChangeDetectorRef,
    private userStorage: UserStorageService,
    private taskStorage: TasksStoreService,
    private userServices: UserServices,
  ) {}

  togleViewPassword() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  togleViewModalForgetPassword() {
    if (!this.email) {
      this.erroMensagem = 'Por favor, insira seu email para alterar a senha.';
      this.modalAberto = true;
      this.isLoadingModal = false;
      return;
    }

    this.isLoadingModal = true;

    this.buscarPorEmail
      .buscaPorEmail(this.email)
      .pipe(
        finalize(() => {
          this.isLoadingModal = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res) => {
          if (!res || !res.id) {
            this.modalAberto = true;
            this.erroMensagem = 'Email não encontrado.';
            return;
          }
          this.isModalEsqueciSenha = true;
        },
        error: (err) => {
          this.modalAberto = true;
          this.erroMensagem = err.mensagem;
        },
      });
  }

  registrarUser() {
    this.router.navigate(['/register']);
  }

  alterarSenha() {
    this.isLoadingModal = true;

    this.userServices
      .atualizarSenhaUser(this.userIdPassword, { novaSenha: this.novaSenha })
      .pipe(
        finalize(() => {
          this.isLoadingModal = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: () => {
          this.isModalEsqueciSenha = false;
          this.sucessoMensagem = 'Senha alterada com sucesso!';
          this.modalSucesso = true;
        },
        error: (err) => {
          this.modalAberto = true;
          this.erroMensagem = err.mensagem;
        },
      });
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
        }),
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
