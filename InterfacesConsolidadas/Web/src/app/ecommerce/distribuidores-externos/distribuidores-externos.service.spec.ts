/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DistribuidoresExternosService } from './distribuidores-externos.service';

describe('Service: DistribuidoresExternos', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DistribuidoresExternosService]
    });
  });

  it('should ...', inject([DistribuidoresExternosService], (service: DistribuidoresExternosService) => {
    expect(service).toBeTruthy();
  }));
});
