import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TasksStoreService {
  private readonly KEY = 'tasks';

  public salvarTask(task: any) {
    if (!task) return;
    localStorage.setItem(this.KEY, JSON.stringify(task));
  }

  public buscarTask() {
    const value = localStorage.getItem(this.KEY);

    if (!value || value == 'undefined') {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  public deleteTask() {
    localStorage.removeItem(this.KEY);
  }
}
