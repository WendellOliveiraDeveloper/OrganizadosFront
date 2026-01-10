import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EnviaFormularioService } from '../../services/envia-formulario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email!: string;
  senha!: string;

  constructor(private enviaLoginRequest: EnviaFormularioService, private router: Router) {}

  registrarUser() {
    this.router.navigate(['/register']);
  }

  enviar() {
    this.enviaLoginRequest.realizaLogin(this.email, this.senha).subscribe({
      next: (res) => {
        console.log('Login realizado com sucesso', res);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        if (err === 404) {
          alert(`Erro: ${err.error}`);
        }

        if (err === 401) {
          alert(`Erro: ${err.error}`);
        }
      },
    });
  }
}
