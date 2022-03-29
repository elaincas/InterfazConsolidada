import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteSucursalComponent } from './reporte-sucursal.component';

describe('ReporteSucursalComponent', () => {
  let component: ReporteSucursalComponent;
  let fixture: ComponentFixture<ReporteSucursalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteSucursalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
