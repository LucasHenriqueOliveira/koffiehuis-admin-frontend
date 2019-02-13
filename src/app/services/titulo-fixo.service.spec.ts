import { TestBed, inject } from '@angular/core/testing';

import { TituloFixoService } from './titulo-fixo.service';

describe('TituloFixoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TituloFixoService]
    });
  });

  it('should be created', inject([TituloFixoService], (service: TituloFixoService) => {
    expect(service).toBeTruthy();
  }));
});
