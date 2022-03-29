import { TestBed, inject } from '@angular/core/testing';

import { SucursalesSellosService } from './sucursales-sellos.service';

describe('SucursalesSellosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SucursalesSellosService]
    });
  });

  it('should be created', inject([SucursalesSellosService], (service: SucursalesSellosService) => {
    expect(service).toBeTruthy();
  }));
});
