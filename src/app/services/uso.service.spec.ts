import { TestBed, inject } from '@angular/core/testing';

import { UsoService } from './uso.service';

describe('UsoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsoService]
    });
  });

  it('should be created', inject([UsoService], (service: UsoService) => {
    expect(service).toBeTruthy();
  }));
});
