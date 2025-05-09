import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { rolebaseGuard } from './rolebase.guard';

describe('rolebaseGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => rolebaseGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
