import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisisParametrosFrmComponent } from './analisis-parametros-frm.component';

describe('ParametrosFrmComponent', () => {
  let component: AnalisisParametrosFrmComponent;
  let fixture: ComponentFixture<AnalisisParametrosFrmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalisisParametrosFrmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisisParametrosFrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
