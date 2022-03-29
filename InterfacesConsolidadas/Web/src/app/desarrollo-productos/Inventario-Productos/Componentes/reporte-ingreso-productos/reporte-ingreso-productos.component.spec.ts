import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteIngresoProductosComponent } from './reporte-ingreso-productos.component';

describe('ReporteIngresoProductosComponent', () => {
  let component: ReporteIngresoProductosComponent;
  let fixture: ComponentFixture<ReporteIngresoProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteIngresoProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteIngresoProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
