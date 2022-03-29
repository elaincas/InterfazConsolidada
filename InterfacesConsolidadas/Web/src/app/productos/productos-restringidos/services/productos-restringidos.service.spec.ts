import { TestBed, inject } from '@angular/core/testing';

import { ProductosRestringidosService } from './productos-restringidos.service';

describe('ProductosDescuentosExclusivosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductosRestringidosService]
    });
  });

  it('should be created', inject([ProductosRestringidosService], (service: ProductosRestringidosService) => {
    expect(service).toBeTruthy();
  }));
});
