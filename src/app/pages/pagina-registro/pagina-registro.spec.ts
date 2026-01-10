import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaRegistro } from './pagina-registro';

describe('PaginaRegistro', () => {
  let component: PaginaRegistro;
  let fixture: ComponentFixture<PaginaRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaRegistro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaRegistro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
