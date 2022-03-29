import { TestBed, inject } from '@angular/core/testing';

import { DistribuidoresComprasDigitalesService } from './distribuidores-compras-digitales.service';

describe('DistribuidoresComprasDigitalesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DistribuidoresComprasDigitalesService]
    });
  });

  it('should be created', inject([DistribuidoresComprasDigitalesService], (service: DistribuidoresComprasDigitalesService) => {
    expect(service).toBeTruthy();
  }));
});
