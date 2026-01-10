import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BuscarUserEmailService } from '../../services/buscar-user-email';
import { CompartilhamentoService } from '../../services/compartilhamento-service';

@Component({
  selector: 'app-navbar-component',
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.scss',
})
export class NavbarComponent implements OnInit {
  user: any = null;
  email!: string;

  constructor(
    private buscarPorEmail: BuscarUserEmailService,
    private service: CompartilhamentoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const emailSalvo = this.service.getEmail();

    if (emailSalvo) {
      this.email = emailSalvo;
      this.buscarDadosUsuario();
    }

    this.service.email$.subscribe((email) => {
      if (!email) return;

      this.email = email;
      this.buscarDadosUsuario();
    });
  }

  buscarDadosUsuario() {
    this.buscarPorEmail.buscaPorEmail(this.email).subscribe({
      next: (res) => {
        this.user = res;
        localStorage.setItem('user', JSON.stringify(res));
        console.log('Usuário carregado:', res.nome);

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Erro ao buscar usuário', err);
        const userSalvo = localStorage.getItem('user');
        if (userSalvo) {
          this.user = JSON.parse(userSalvo);
          this.cdr.detectChanges();
        }
      },
    });
  }
}
