import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteZonaComponent } from './reporte-zona.component';

describe('ReporteZonaComponent', () => {
  let component: ReporteZonaComponent;
  let fixture: ComponentFixture<ReporteZonaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteZonaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteZonaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
