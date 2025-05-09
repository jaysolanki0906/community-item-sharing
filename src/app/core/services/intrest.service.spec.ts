import { TestBed } from '@angular/core/testing';

import { IntrestService } from './intrest.service';

describe('IntrestService', () => {
  let service: IntrestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntrestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
