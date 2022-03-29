import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteInicioComponent } from './reporte-inicio.component';

describe('ReporteInicioComponent', () => {
  let component: ReporteInicioComponent;
  let fixture: ComponentFixture<ReporteInicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteInicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
