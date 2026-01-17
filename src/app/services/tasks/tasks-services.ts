import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TasksServices {
  private readonly apiUrlKey = `${environment.apiUrl}/tarefas`;

  constructor(private http: HttpClient) {}

  buscarTarefasByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlKey}/all_tasks/${userId}`);
  }

  buscarQuantidadeTarefasByUserId(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlKey}/get_tasks_count_by_user/${userId}`);
  }
}
