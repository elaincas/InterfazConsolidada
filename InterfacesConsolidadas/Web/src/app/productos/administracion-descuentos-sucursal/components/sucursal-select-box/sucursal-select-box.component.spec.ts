import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalSelectBoxComponent } from './sucursal-select-box.component';

describe('SucursalSelectBoxComponent', () => {
  let component: SucursalSelectBoxComponent;
  let fixture: ComponentFixture<SucursalSelectBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SucursalSelectBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SucursalSelectBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
