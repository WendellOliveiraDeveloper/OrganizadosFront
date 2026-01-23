import { ChangeDetectorRef, Component } from '@angular/core';
import { Modal } from '../../components/modal/modal';
import { NavbarComponent } from '../../components/navbar-component/navbar-component';
import { CardsComponent } from '../../components/cards-component/cards-component';
import { TasksServices } from '../../services/tasks/tasks-services';
import { UserStorageService } from '../../services/user-storage-service';
import { LoadingComponent } from '../../components/loading-component/loading-component';
import { finalize, forkJoin } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pagina-principal',
  imports: [
    Modal,
    NavbarComponent,
    CardsComponent,
    LoadingComponent,
    FaIconComponent,
    FontAwesomeModule,
  ],
  templateUrl: './pagina-principal.html',
  styleUrl: './pagina-principal.scss',
})
export class PaginaPrincipal {
  public user: any;
  public tasks: any;
  public qtdTasksAtrasadas: number = 0;
  public msgErro: string = '';
  public isModalLoading: boolean = false;
  public isModalErroAberto: boolean = false;
  public faCicleExclamationIcon = faCircleExclamation;

  constructor(
    private userStorage: UserStorageService,
    private tasksServices: TasksServices,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const userSalvo = this.userStorage.buscar();

    if (userSalvo) {
      this.user = userSalvo;
      this.buscarTarefasAtrasadasByUser(this.user.id);
    }
  }

  public buscarTarefasAtrasadasByUser(userId: number) {
    this.isModalLoading = true;

    forkJoin({
      tarefas: this.tasksServices.buscarTaskAtrasadasByUserId(userId),
      quantidade: this.tasksServices.buscarQuantidadeTasksAtrasadasByUserId(userId),
    })
      .pipe(
        finalize(() => {
          this.isModalLoading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: ({ tarefas, quantidade }) => {
          this.tasks = tarefas;
          this.qtdTasksAtrasadas = quantidade;
        },
        error: (err) => {
          this.tratarErro(err);
        },
      });
  }

  private tratarErro(err: HttpErrorResponse): void {
    if (err.status === 0) {
      this.msgErro = 'Erro de conexão com o servidor. Verifique se o servidor está rodando.';
    } else if (err.status) {
      this.msgErro =
        err.error?.message ||
        err.error?.mensagem ||
        err.message ||
        `Erro ${err.status}  inesperado!`;
    } else {
      this.msgErro = 'Erro desconhecido ao tentar buscar dados.';
    }
    this.isModalErroAberto = true;
  }
}
