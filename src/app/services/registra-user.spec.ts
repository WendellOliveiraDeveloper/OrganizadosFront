import { TestBed } from '@angular/core/testing';

import { RegistraUser } from './registra-user';

describe('RegistraUser', () => {
  let service: RegistraUser;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistraUser);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
