/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ColoniaServiceService } from './coloniaService.service';

describe('Service: ColoniaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ColoniaServiceService]
    });
  });

  it('should ...', inject([ColoniaServiceService], (service: ColoniaServiceService) => {
    expect(service).toBeTruthy();
  }));
});
