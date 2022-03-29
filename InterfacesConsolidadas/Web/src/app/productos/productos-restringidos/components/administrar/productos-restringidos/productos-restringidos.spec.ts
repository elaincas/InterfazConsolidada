import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductosRestringidosComponent } from './productos-restringidos';

describe('ProductosDescuentosExclusivosComponent', () => {
  let component: ProductosRestringidosComponent;
  let fixture: ComponentFixture<ProductosRestringidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductosRestringidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductosRestringidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
