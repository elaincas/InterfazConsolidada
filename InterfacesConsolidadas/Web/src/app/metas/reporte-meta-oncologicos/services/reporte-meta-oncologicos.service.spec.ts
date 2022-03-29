import { TestBed, inject } from '@angular/core/testing';

import { ReporteMetaOncologicosService } from './reporte-meta-oncologicos.service';

describe('ReporteMetaOncologicosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReporteMetaOncologicosService]
    });
  });

  it('should be created', inject([ReporteMetaOncologicosService], (service: ReporteMetaOncologicosService) => {
    expect(service).toBeTruthy();
  }));
});
