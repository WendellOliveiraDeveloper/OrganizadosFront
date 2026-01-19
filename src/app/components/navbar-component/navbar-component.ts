import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BuscarUserEmailService } from '../../services/buscar-user-email';
import { CompartilhamentoService } from '../../services/compartilhamento-service';
import { UserStorageService } from '../../services/user-storage-service';
import { Router, RouterLinkActive, RouterLinkWithHref } from '@angular/router';
import { imagens } from '../../icons/imagem-services';
import { TasksStoreService } from '../../services/tasks/tasks-store-service';

@Component({
  selector: 'app-navbar-component',
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.scss',
  imports: [RouterLinkActive, RouterLinkWithHref],
})
export class NavbarComponent implements OnInit {
  user: any = null;
  email!: string;
  corFundo: string = '#21c0a4';

  componentsLaterais = [
    {
      label: 'Inicio',
      icon: imagens.home,
      alt: 'imagem_casa',
      route: '/home',
      cor: this.corFundo,
    },
    {
      label: 'Tarefas',
      icon: imagens.allTasks,
      alt: 'imagem_caderno',
      route: '/tarefas',
      cor: this.corFundo,
    },
    {
      label: 'Configurações',
      icon: imagens.config,
      alt: 'imagem_engrenagem',
      route: '/configuracoes',
      cor: this.corFundo,
    },
  ];

  constructor(
    private buscarPorEmail: BuscarUserEmailService,
    private userStorage: UserStorageService,
    private router: Router,
    private userService: CompartilhamentoService,
    private tasksStorage: TasksStoreService
  ) {}

  ngOnInit(): void {
    const userSalvo = this.userStorage.buscar();

    if (userSalvo) {
      this.user = userSalvo;
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
    this.tasksStorage.deleteTask();
    this.router.navigate(['/']);
  }
}
