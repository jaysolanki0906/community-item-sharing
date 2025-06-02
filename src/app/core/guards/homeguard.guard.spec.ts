import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { homeguardGuard } from './homeguard.guard';

describe('homeguardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => homeguardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
