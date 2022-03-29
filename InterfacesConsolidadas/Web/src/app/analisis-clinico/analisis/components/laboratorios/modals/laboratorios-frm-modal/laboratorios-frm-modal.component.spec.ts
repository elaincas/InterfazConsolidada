import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoriosFrmModalComponent } from './laboratorios-frm-modal.component';

describe('LaboratoriosFrmModalComponent', () => {
  let component: LaboratoriosFrmModalComponent;
  let fixture: ComponentFixture<LaboratoriosFrmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaboratoriosFrmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaboratoriosFrmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
