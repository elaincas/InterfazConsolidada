import { TestBed, inject } from '@angular/core/testing';

import { VariablesDeConfiguracionService } from './variables-de-configuracion.service';

describe('VariablesDeConfiguracionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VariablesDeConfiguracionService]
    });
  });

  it('should be created', inject([VariablesDeConfiguracionService], (service: VariablesDeConfiguracionService) => {
    expect(service).toBeTruthy();
  }));
});
