import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistraUser } from '../../services/registra-user';
import { LabelComponent } from '../../components/label-component/label-component';
import { Modal } from '../../components/modal/modal';

@Component({
  selector: 'app-pagina-registro',
  imports: [LabelComponent, CommonModule, FormsModule, Modal],
  templateUrl: './pagina-registro.html',
  styleUrl: './pagina-registro.scss',
})
export class PaginaRegistro {
  nome!: string;
  email!: string;
  senha!: string;
  telefone!: string;
  modalAberto: boolean = false;
  erroMensagem: string = '';

  constructor(private registraUserService: RegistraUser, private router: Router) {}

  voltarPaginaLogin() {
    this.router.navigate(['/login']);
  }

  enviaRegistro() {
    this.registraUserService
      .realizaCadastro(this.email, this.nome, this.senha, this.telefone)
      .subscribe({
        next: (res) => {
          alert('Usuário registrado com sucesso!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.modalAberto = true;
          this.erroMensagem =
            err?.error?.mensagem || err?.error?.message || 'Erro inesperado ao registrar usuário';
        },
      });
  }
}
