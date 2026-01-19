import {ChangeDetectorRef, Component, OnChanges} from '@angular/core';
import {NavbarComponent} from '../../components/navbar-component/navbar-component';
import {TasksServices} from '../../services/tasks/tasks-services';
import {UserStorageService} from '../../services/user-storage-service';
import {Modal} from '../../components/modal/modal';
import {HttpErrorResponse} from '@angular/common/http';
import {LoadingComponent} from '../../components/loading-component/loading-component';
import {TasksStoreService} from '../../services/tasks/tasks-store-service';
import {FormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {finalize, forkJoin} from 'rxjs';
import {LabelComponent} from '../../components/label-component/label-component';
import {imagens} from '../../icons/imagem-services';
import {MatTooltipModule} from '@angular/material/tooltip';

export enum StatusTaskEnum {
  COMPLETO = 0,
  EM_ANDAMENTO = 1,
  A_FAZER = 2,
  ATRASADO = 3
}

@Component({
  selector: 'app-pagina-tarefas',
  imports: [
    NavbarComponent,
    Modal,
    LoadingComponent,
    FormsModule,
    CommonModule,
    LabelComponent,
    MatTooltipModule,
  ],
  templateUrl: './pagina-tarefas.html',
  styleUrl: './pagina-tarefas.scss',
})
export class PaginaTarefas {
  user!: any;
  task!: any;
  allTasks!: any;
  qtdTasks!: number;
  isModalErroAberto: boolean = false;
  isLoadingModal: boolean = false;
  isModalEditarAberto: boolean = false;
  isModalSucessoAberto: boolean = false;
  isEditando: boolean = false;
  mensagemErro: string = '';
  checked!: boolean;
  tituloModal!: string;
  iconAdicionar: string = imagens.adicionar;
  iconDelete: string = imagens.excluir;
  taskIdDelete!: number;
  mensagemSucesso: string = '';

  tituloTabela = [
    {
      name: 'Tarefa',
    },
    {
      name: 'Data',
    },
    {
      name: 'Status',
    },
  ];

  tiposStatusTasks = [
    'COMPLETO',
    'EM_ANDAMENTO',
    'A_FAZER',
    'ATRASADO'
  ]

  constructor(
    private userStorage: UserStorageService,
    private tasksServices: TasksServices,
    private tasksStorage: TasksStoreService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    const userSalvo = this.userStorage.buscar();
    const qtdTarefasSalvas = this.tasksStorage.buscarTask();

    if (userSalvo) {
      this.user = userSalvo;
      this.qtdTasks = qtdTarefasSalvas;
      this.buscarTarefasByUser();
      this.cdr.detectChanges();
    }
  }

  public verificarAtraso(task: any): string {
    if (!task?.dataTarefa) return task.tiposTasks;

    const [dia, mes, ano] = task.dataTarefa.split('/');
    const dataTask = new Date(Number(ano), Number(mes) - 1, Number(dia));

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dataTask < hoje && task.tiposTasks !== 'COMPLETO') {
      return 'ATRASADO';
    }

    return task.tiposTasks;
  }

  public abrirModalCriarTask() {
    this.isEditando = false;
    this.tituloModal = 'Criar nova tarefa';
    this.task = {
      nomeTarefa: '',
      descricaoTarefa: '',
      dataTarefa: '',
      tiposTasks: 'A FAZER',
      userID: this.user?.id,
    };
    this.isModalEditarAberto = true;
  }

  public criarNovaTask() {
    if (
      !this.task.nomeTarefa ||
      !this.task.descricaoTarefa ||
      !this.task.dataTarefa
    ) {
      alert('Preencha os dados');
      return;
    }

    const statusNumerico = this.statusTaskMap[this.task.tiposTasks];

    if (statusNumerico === undefined) {
      alert('Status inválido');
      return;
    }

    const payload = {
      ...this.task,
      tiposTasks: statusNumerico,
    }

    this.isLoadingModal = true;

    this.tasksServices.criarNovaTask(payload)
      .pipe(
        finalize(() => {
          this.isLoadingModal = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.isModalEditarAberto = false;
          this.mensagemSucesso = 'Tarefa cadastrada com sucesso!'
          this.isModalSucessoAberto = true;

          this.buscarTarefasByUser();
        },
        error: (err: HttpErrorResponse) => {
          this.tratarErro(err);
        }
      })
  }


  public editarTarefa(idx: number) {
    this.tituloModal = 'Editar tarefa';
    this.isEditando = true;
    const task = {...this.allTasks[idx]};

    this.task = task;
    this.isModalEditarAberto = true;
  }

  editarTask() {
    this.isLoadingModal = true

    this.tasksServices.editarTask(this.user?.id, this.task)
      .pipe(
        finalize(() => {
          this.isLoadingModal = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (res) => {
          this.isModalEditarAberto = false;
          this.mensagemSucesso = 'Edição realizada com sucesso!';
          this.isModalSucessoAberto = true;

          this.buscarTarefasByUser();
        },
        error: (err: HttpErrorResponse) => {
          this.isModalEditarAberto = false;
          this.tratarErro(err);
        }
      })
  }

  public buscarTarefasByUser() {
    this.isLoadingModal = true;

    const tarefas$ = this.tasksServices.buscarTarefasByUserId(this.user?.id);
    const qtd$ = this.tasksServices.buscarQuantidadeTarefasByUserId(this.user?.id);

    forkJoin({allTasks: tarefas$, qtd: qtd$})
      .pipe(
        finalize(() => {
          this.isLoadingModal = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res) => {
          this.allTasks = (res.allTasks || []).map((task: any) => ({
            ...task,
            tiposTasks: this.verificarAtraso(task),
          }));
          this.qtdTasks = res.qtd || 0;
          this.tasksStorage.salvarTask(res.qtd || 0);
        },
        error: (err: HttpErrorResponse) => {
          this.tratarErro(err);
          this.allTasks = [];
          this.qtdTasks = 0;
        },
      });
  }

  buscarQuantidadeTarefas(): void {
    this.tasksServices.buscarQuantidadeTarefasByUserId(this?.user?.id).subscribe({
      next: (res) => {
        this.qtdTasks = res;
        this.tasksStorage.salvarTask(res);
      },
      error: (err: HttpErrorResponse) => {
        this.tratarErro(err);

        this.mensagemErro = `Erro inesperado ao trazer seus dados: ${err.error?.mensagem}`;
        this.isModalErroAberto = true;
      },
    });
  }

  public armazenaTaskId(task: any): number {
    return this.taskIdDelete = task.taskId;
  }

  public excluirTarefaById(task: any): void {
    this.isLoadingModal = true;

    this.tasksServices.excluirTarefa(this?.taskIdDelete, this.user?.id)
      .pipe(
        finalize(() => {
          this.isLoadingModal = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.isModalSucessoAberto = true;
          this.mensagemSucesso = 'Tarefa deletada!';

          this.buscarTarefasByUser();
        },
        error: (err: HttpErrorResponse) => {
          this.tratarErro(err);
        }
      })
  }


  private tratarErro(err: HttpErrorResponse): void {
    if (err.status === 0) {
      this.mensagemErro = 'Erro de conexão com o servidor. Verifique se o servidor está rodando.';
    } else if (err.status) {
      this.mensagemErro =
        err.error?.message ||
        err.error?.mensagem ||
        err.message ||
        `Erro ${err.status}  inesperado!`;
    } else {
      this.mensagemErro = 'Erro desconhecido ao tentar buscar dados.';
    }
    this.isModalErroAberto = true;
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ');
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETO':
        return 'status-completo';
      case 'EM_ANDAMENTO':
        return 'status-em-andamento';
      case 'A_FAZER':
        return 'status-a-fazer';
      case 'ATRASADO':
        return 'status-atrasado';
      default:
        return '';
    }
  }

  statusTaskMap: Record<string, number> = {
    COMPLETO: StatusTaskEnum.COMPLETO,
    EM_ANDAMENTO: StatusTaskEnum.EM_ANDAMENTO,
    A_FAZER: StatusTaskEnum.A_FAZER,
    ATRASADO: StatusTaskEnum.ATRASADO
  };
}
