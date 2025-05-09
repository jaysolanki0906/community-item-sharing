import { TestBed } from '@angular/core/testing';

import { HttpInspectorService } from './http-inspector.service';

describe('HttpInspectorService', () => {
  let service: HttpInspectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpInspectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
