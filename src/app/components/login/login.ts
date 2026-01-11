import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnviaFormularioService } from '../../services/envia-formulario';
import { Router } from '@angular/router';
import { Modal } from '../modal/modal';
import { CompartilhamentoService } from '../../services/compartilhamento-service';
import { BuscarUserEmailService } from '../../services/buscar-user-email';
import { UserStorageService } from '../../services/user-storage-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, Modal],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  user: any = null;
  email!: string;
  senha!: string;
  modalAberto: boolean = false;
  erroMensagem!: string;

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
    this.enviaLoginRequest.realizaLogin(this.email, this.senha).subscribe({
      next: () => {
        this.userStorage.limpar();
        this.user = this.buscarDadosUsuario();
        this.userStorage.salvar(this.user);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        if (err.status === 404 || err.status === 401) {
          this.erroMensagem =
            err?.error?.mensagem || err?.error?.message || 'Erro ao realizar login';

          this.modalAberto = true;
        }
      },
    });
  }

  buscarDadosUsuario() {
    this.buscarPorEmail.buscaPorEmail(this.email).subscribe({
      next: (res) => {
        this.user = res;
        this.userStorage.salvar(this.user);

        this.cdr.detectChanges();
      },
      error: (err) => {
        const userSalvo = localStorage.getItem('user');
        if (userSalvo) {
          this.user = JSON.parse(userSalvo);
          this.cdr.detectChanges();
        }
      },
    });
  }
}
