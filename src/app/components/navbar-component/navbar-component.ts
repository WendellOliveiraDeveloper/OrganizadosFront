import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BuscarUserEmailService } from '../../services/buscar-user-email';
import { CompartilhamentoService } from '../../services/compartilhamento-service';
import { UserStorageService } from '../../services/user-storage-service';
import { Router, RouterLinkActive } from '@angular/router';
import { imagens } from '../../icons/imagem-services';

@Component({
  selector: 'app-navbar-component',
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.scss',
  imports: [RouterLinkActive],
})
export class NavbarComponent implements OnInit {
  user: any = null;
  email!: string;

  componentsLaterais = [
    {
      label: 'Tarefas',
      icon: imagens.allTasks,
      alt: 'imagem_caderno',
      route: '/tarefas',
    },
    {
      label: 'Configurações',
      icon: imagens.config,
      alt: 'imagem_engrenagem',
      route: '/configuracoes',
    },
  ];

  constructor(
    private buscarPorEmail: BuscarUserEmailService,
    private userStorage: UserStorageService,
    private router: Router,
    private userService: CompartilhamentoService
  ) {}

  ngOnInit(): void {
    const userSalvo = this.userStorage.buscar();
    console.log(`user salvo: ${userSalvo}`);

    if (userSalvo) {
      this.user = userSalvo;
      console.log(`nome user: ${this.user.nome}`);
    } else {
      this.buscarDadosUsuario();
    }
  }

  buscarDadosUsuario() {
    this.buscarPorEmail.buscaPorEmail(this.email).subscribe({
      next: (res) => {
        this.user = res;
        this.userStorage.salvar(this.user);
        this.email = this.user?.email;
      },
      error: (err) => {
        const userSalvo = localStorage.getItem('user');
        if (userSalvo) {
          this.user = JSON.parse(userSalvo);
        }
      },
    });
  }

  sairDoSistema() {
    this.userStorage.limpar();
    this.router.navigate(['/']);
  }
}
