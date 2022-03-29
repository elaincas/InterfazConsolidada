import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosDescuentosExclusivosComponent } from './productos-descuentos-exclusivos.component';

describe('ProductosDescuentosExclusivosComponent', () => {
  let component: ProductosDescuentosExclusivosComponent;
  let fixture: ComponentFixture<ProductosDescuentosExclusivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductosDescuentosExclusivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosDescuentosExclusivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
