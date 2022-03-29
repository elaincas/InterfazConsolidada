import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisisLaboratoriosFrmComponent } from './analisis-laboratorios-frm.component';

describe('AnalisisLaboratoriosFrmComponent', () => {
  let component: AnalisisLaboratoriosFrmComponent;
  let fixture: ComponentFixture<AnalisisLaboratoriosFrmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalisisLaboratoriosFrmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisisLaboratoriosFrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
