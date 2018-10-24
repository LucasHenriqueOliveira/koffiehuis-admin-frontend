import { TestBed, inject } from '@angular/core/testing';

import { VeiculoService } from './veiculo.service';

describe('VeiculoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VeiculoService]
    });
  });

  it('should be created', inject([VeiculoService], (service: VeiculoService) => {
    expect(service).toBeTruthy();
  }));
});
