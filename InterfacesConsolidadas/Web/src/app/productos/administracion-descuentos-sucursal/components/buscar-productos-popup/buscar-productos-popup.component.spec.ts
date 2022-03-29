import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarProductosPopupComponent } from './buscar-productos-popup.component';

describe('BuscarProductosPopupComponent', () => {
  let component: BuscarProductosPopupComponent;
  let fixture: ComponentFixture<BuscarProductosPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarProductosPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuscarProductosPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
