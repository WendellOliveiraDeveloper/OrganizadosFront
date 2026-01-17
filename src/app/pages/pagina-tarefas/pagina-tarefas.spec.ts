import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaTarefas } from './pagina-tarefas';

describe('PaginaTarefas', () => {
  let component: PaginaTarefas;
  let fixture: ComponentFixture<PaginaTarefas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaTarefas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaTarefas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
