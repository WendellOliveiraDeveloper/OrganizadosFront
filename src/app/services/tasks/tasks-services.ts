import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TasksServices {
  private readonly apiUrlKey = `${environment.apiUrl}/tarefas`;

  constructor(private http: HttpClient) {
  }

  buscarTarefasByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlKey}/all_tasks/${userId}`);
  }

  buscarQuantidadeTarefasByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlKey}/get_tasks_count_by_user/${userId}`);
  }

  criarNovaTask(task: any): Observable<any> {
    return this.http
      .post(`${this.apiUrlKey}/add_task`, task)
      .pipe(
        catchError((err) => {
          let mensagemErro = 'Erro ao cadastrar uma nova tarefa';

          if (err.status === 401 || err.status === 404) {
            mensagemErro = err?.error?.message ?? mensagemErro;
          }

          return throwError(() => ({
            status: err.status,
            mensagemErro
          }));
        })
      );
  }

  excluirTarefa(idTask: number, userId: number) {
    return this.http
      .delete(`${this.apiUrlKey}/delete_task/${idTask}/${userId}`)
      .pipe(
        catchError((err) => {
          let mensagemDeErro = 'Erro ao tentar excluir sua tarefa';

          if (err.status === 401 || err.status === 404) {
            mensagemDeErro = err?.error?.message ?? mensagemDeErro;
          }

          return throwError(() => ({
            status: err.status,
            mensagemDeErro
          }));
        })
      )
  }

}
