import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnviaFormularioService } from '../../services/envia-formulario';
import { Router } from '@angular/router';
import { Modal } from '../modal/modal';
import { CompartilhamentoService } from '../../services/compartilhamento-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email!: string;
  senha!: string;
  modalAberto: boolean = false;
  erroMensagem!: string;

  constructor(
    private enviaLoginRequest: EnviaFormularioService,
    private router: Router,
    private service: CompartilhamentoService
  ) {}

  registrarUser() {
    this.router.navigate(['/register']);
  }

  enviaEmailParaPrincipalPage() {
    this.service.setEmail(this.email);
  }

  enviar() {
    this.enviaLoginRequest.realizaLogin(this.email, this.senha).subscribe({
      next: (res) => {
        console.log('Login realizado com sucesso', res);
        this.enviaEmailParaPrincipalPage();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        if (err.status === 404 || err.status === 401) {
          this.erroMensagem =
            err?.error?.mensagem || err?.error?.message || 'Erro ao realizar login';

          console.log('modalAberto antes:', this.modalAberto);

          this.modalAberto = true;

          console.log('modalAberto depois:', this.modalAberto);
        }
      },
    });
  }
}
