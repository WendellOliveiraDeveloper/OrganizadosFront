import { TestBed } from '@angular/core/testing';

import { BuscarUserEmail } from './buscar-user-email';

describe('BuscarUserEmail', () => {
  let service: BuscarUserEmail;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuscarUserEmail);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
