import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoTipoFrmModalComponent } from './resultado-tipo-frm-modal.component';

describe('ResultadoTipoFrmModalComponent', () => {
  let component: ResultadoTipoFrmModalComponent;
  let fixture: ComponentFixture<ResultadoTipoFrmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultadoTipoFrmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoTipoFrmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
