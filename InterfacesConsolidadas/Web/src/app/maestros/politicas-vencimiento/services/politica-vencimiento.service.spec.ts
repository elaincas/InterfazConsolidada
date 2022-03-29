import { TestBed, inject } from '@angular/core/testing';

import { PoliticaVencimientoService } from './politica-vencimiento.service';

describe('EtiquetasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoliticaVencimientoService]
    });
  });

  it('should be created', inject([PoliticaVencimientoService], (service: PoliticaVencimientoService) => {
    expect(service).toBeTruthy();
  }));
});
