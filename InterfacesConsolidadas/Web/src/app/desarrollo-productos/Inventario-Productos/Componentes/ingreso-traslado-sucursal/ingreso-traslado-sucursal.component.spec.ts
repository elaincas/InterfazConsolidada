import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresoTrasladoSucursalComponent } from './ingreso-traslado-sucursal.component';

describe('IngresoTrasladoSucursalComponent', () => {
  let component: IngresoTrasladoSucursalComponent;
  let fixture: ComponentFixture<IngresoTrasladoSucursalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngresoTrasladoSucursalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresoTrasladoSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
