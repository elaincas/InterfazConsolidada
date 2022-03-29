/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MercadeoService } from './mercadeo.service';

describe('Service: Mercadeo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MercadeoService]
    });
  });

  it('should ...', inject([MercadeoService], (service: MercadeoService) => {
    expect(service).toBeTruthy();
  }));
});
