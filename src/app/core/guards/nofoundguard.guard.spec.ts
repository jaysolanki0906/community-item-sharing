import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { nofoundguardGuard } from './nofoundguard.guard';

describe('nofoundguardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => nofoundguardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
