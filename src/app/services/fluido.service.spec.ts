import { TestBed, inject } from '@angular/core/testing';

import { FluidoService } from './fluido.service';

describe('FluidoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FluidoService]
    });
  });

  it('should be created', inject([FluidoService], (service: FluidoService) => {
    expect(service).toBeTruthy();
  }));
});
