import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteComparativoComponent } from './reporte-comparativo.component';

describe('ReporteComparativoComponent', () => {
  let component: ReporteComparativoComponent;
  let fixture: ComponentFixture<ReporteComparativoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteComparativoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteComparativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
