import { TestBed, inject } from '@angular/core/testing';

import { OpcionaisService } from './opcionais.service';

describe('OpcionaisService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OpcionaisService]
    });
  });

  it('should be created', inject([OpcionaisService], (service: OpcionaisService) => {
    expect(service).toBeTruthy();
  }));
});
