import { TestBed, inject } from '@angular/core/testing';

import { ProductosDescuentosExclusivosService } from './productos-descuentos-exclusivos.service';

describe('ProductosDescuentosExclusivosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductosDescuentosExclusivosService]
    });
  });

  it('should be created', inject([ProductosDescuentosExclusivosService], (service: ProductosDescuentosExclusivosService) => {
    expect(service).toBeTruthy();
  }));
});
