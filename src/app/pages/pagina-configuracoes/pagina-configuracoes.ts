import { ChangeDetectorRef, Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar-component/navbar-component';
import { LabelComponent } from '../../components/label-component/label-component';
import { UserStorageService } from '../../services/user-storage-service';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Modal } from '../../components/modal/modal';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { UserServices } from '../../services/user/user-services';

@Component({
  selector: 'app-pagina-configuracoes',
  imports: [
    NavbarComponent,
    LabelComponent,
    FormsModule,
    Modal,
    MatTooltipModule,
    FaIconComponent,
    FontAwesomeModule,
  ],
  templateUrl: './pagina-configuracoes.html',
  styleUrl: './pagina-configuracoes.scss',
})
export class PaginaConfiguracoes {
  public user: any;
  public mensagemErro: string = '';
  public isLoadingModal: boolean = false;
  public isModalErroAberto: boolean = false;
  public isModalAlterarSenha: boolean = false;
  public isModalSucessoAberto: boolean = false;
  public mostrarSenha = false;
  public novaSenha = '';
  public errorTelefone: boolean = false;
  public mensagemSucesso: string = '';
  public faEye = faEye;
  public faEyeSlash = faEyeSlash;

  toggleSenha() {
    this.mostrarSenha = !this.mostrarSenha;
  }

  public constructor(
    private userStorage: UserStorageService,
    private userServices: UserServices,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const userSalvo = this.userStorage.buscar();

    if (userSalvo) {
      this.user = userSalvo;
      this.cdr.detectChanges();
    }
  }

  public abrirModalAlterarSenha(): void {
    this.isModalAlterarSenha = !this.isModalAlterarSenha;
  }

  public atualizarDadosUser(): void {
    this.isLoadingModal = true;

    this.userServices
      .atualizarUser(this.user?.id, this.user)
      .pipe(
        finalize(() => {
          this.isLoadingModal = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res) => {
          this.mensagemSucesso = 'Dados atualizados com sucesso!';
          this.userStorage.salvar(res);
          this.isModalSucessoAberto = true;
        },
      });
  }

  public atualizarSenhaUser(): void {
    this.isLoadingModal = true;

    this.userServices
      .atualizarSenhaUser(this.user.id, { novaSenha: this.novaSenha })
      .pipe(
        finalize(() => {
          this.isLoadingModal = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (res) => {
          this.isModalAlterarSenha = false;
          this.mensagemSucesso = 'Senha atualizada com sucesso!';
          this.isModalSucessoAberto = true;
        },
        error: (err: HttpErrorResponse) => {
          this.isModalAlterarSenha = false;
          this.tratarErro(err);
        },
      });
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
}
