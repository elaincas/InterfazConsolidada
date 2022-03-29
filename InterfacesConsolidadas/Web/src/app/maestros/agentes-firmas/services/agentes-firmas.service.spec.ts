import { TestBed, inject } from '@angular/core/testing';

import { AgentesFirmasService } from './agentes-firmas.service';

describe('AgentesFirmasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgentesFirmasService]
    });
  });

  it('should be created', inject([AgentesFirmasService], (service: AgentesFirmasService) => {
    expect(service).toBeTruthy();
  }));
});
