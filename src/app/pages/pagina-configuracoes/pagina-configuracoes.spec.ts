import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaConfiguracoes } from './pagina-configuracoes';

describe('PaginaConfiguracoes', () => {
  let component: PaginaConfiguracoes;
  let fixture: ComponentFixture<PaginaConfiguracoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaConfiguracoes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaConfiguracoes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
