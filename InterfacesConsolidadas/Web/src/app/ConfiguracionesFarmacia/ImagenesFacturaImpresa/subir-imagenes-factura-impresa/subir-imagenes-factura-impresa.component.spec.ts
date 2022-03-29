import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirImagenesFacturaImpresaComponent } from './subir-imagenes-factura-impresa.component';

describe('SubirImagenesFacturaImpresaComponent', () => {
  let component: SubirImagenesFacturaImpresaComponent;
  let fixture: ComponentFixture<SubirImagenesFacturaImpresaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubirImagenesFacturaImpresaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirImagenesFacturaImpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
