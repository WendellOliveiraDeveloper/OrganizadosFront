import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistraUser } from '../../services/registra-user';
import { LabelComponent } from '../../components/label-component/label-component';
import { Modal } from '../../components/modal/modal';
import { LoadingComponent } from '../../components/loading-component/loading-component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pagina-registro',
  imports: [LabelComponent, CommonModule, FormsModule, Modal, LoadingComponent],
  templateUrl: './pagina-registro.html',
  styleUrl: './pagina-registro.scss',
})
export class PaginaRegistro {
  nome!: string;
  email!: string;
  senha!: string;
  telefone!: string;
  modalSucessoAberto: boolean = false;
  modalErroAberto: boolean = false;
  erroMensagem: string = '';
  mensagemSucesso: string = '';
  isLoadingModal: boolean = false;

  constructor(
    private registraUserService: RegistraUser,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  voltarPaginaLogin() {
    this.router.navigate(['/login']);
  }

  enviaRegistro() {
    if (!this.nome || !this.email || !this.senha) {
      this.erroMensagem = 'Preencha todos os campos obrigatórios';
      this.modalErroAberto = true;
      return;
    }

    this.isLoadingModal = true;
    this.modalSucessoAberto = false;
    this.modalErroAberto = false;

    this.registraUserService
      .realizaCadastro(this.email, this.nome, this.senha, this.telefone)
      .subscribe({
        next: (response) => {
          this.isLoadingModal = false;
          this.mensagemSucesso = `O usuário ${this.nome} foi registrado com sucesso!`;
          this.modalSucessoAberto = true;
          console.log('Registro realizado com sucesso:', response);

          this.cdr.detectChanges();

          setTimeout(() => {
            this.modalSucessoAberto = false;
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err: HttpErrorResponse) => {
          this.isLoadingModal = false;

          if (err.status === 0) {
            this.erroMensagem =
              'Erro de conexão com o servidor. Verifique se o servidor está rodando.';
          } else if (err.status) {
            this.erroMensagem =
              err.error?.message ||
              err.error?.mensagem ||
              err.message ||
              `Erro ${err.status} ao registrar`;
          } else {
            this.erroMensagem = 'Erro desconhecido ao tentar registrar.';
          }

          this.modalErroAberto = true;

          console.error('Erro no registro:', err);
        },
        complete: () => {
          this.isLoadingModal = false;
          console.log('Requisição completa');
        },
      });
  }
}
