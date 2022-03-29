import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalesSellosPopupComponent } from './sucursales-sellos-popup.component';

describe('SucursalesSellosPopupComponent', () => {
  let component: SucursalesSellosPopupComponent;
  let fixture: ComponentFixture<SucursalesSellosPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SucursalesSellosPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SucursalesSellosPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
