import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelResultadoFrmModalComponent } from './nivel-resultado-frm-modal.component';

describe('NivelResultadoFrmModalComponent', () => {
  let component: NivelResultadoFrmModalComponent;
  let fixture: ComponentFixture<NivelResultadoFrmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NivelResultadoFrmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelResultadoFrmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
