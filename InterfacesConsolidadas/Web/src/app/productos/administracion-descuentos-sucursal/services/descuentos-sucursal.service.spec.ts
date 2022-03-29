import { TestBed, inject } from '@angular/core/testing';

import { DescuentosSucursalService } from './descuentos-sucursal.service';

describe('DescuentosSucursalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DescuentosSucursalService]
    });
  });

  it('should be created', inject([DescuentosSucursalService], (service: DescuentosSucursalService) => {
    expect(service).toBeTruthy();
  }));
});
