import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionSucursalesSellosComponent } from './administracion-sucursales-sellos.component';

describe('AdministracionSucursalesSellosComponent', () => {
  let component: AdministracionSucursalesSellosComponent;
  let fixture: ComponentFixture<AdministracionSucursalesSellosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministracionSucursalesSellosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionSucursalesSellosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
