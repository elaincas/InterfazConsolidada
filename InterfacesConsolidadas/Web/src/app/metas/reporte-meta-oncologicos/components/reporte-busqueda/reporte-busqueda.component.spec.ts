import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteBusquedaComponent } from './reporte-busqueda.component';

describe('ReporteBusquedaComponent', () => {
  let component: ReporteBusquedaComponent;
  let fixture: ComponentFixture<ReporteBusquedaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteBusquedaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteBusquedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
