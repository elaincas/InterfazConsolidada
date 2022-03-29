import { TestBed, inject } from '@angular/core/testing';

import { ProductosReproducionesService } from './productos-reproduciones.service';

describe('ProductosDescuentosExclusivosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductosReproducionesService]
    });
  });

  it('should be created', inject([ProductosReproducionesService], (service: ProductosReproducionesService) => {
    expect(service).toBeTruthy();
  }));
});
