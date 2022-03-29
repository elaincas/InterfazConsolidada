import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisisInsumosFrmComponent } from './analisis-insumos-frm.component';

describe('AnalisisInsumosFrmComponent', () => {
  let component: AnalisisInsumosFrmComponent;
  let fixture: ComponentFixture<AnalisisInsumosFrmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalisisInsumosFrmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisisInsumosFrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
