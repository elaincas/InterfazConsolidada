import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GruposProductosComponent } from './grupos-productos.component';

describe('GruposProductosComponent', () => {
  let component: GruposProductosComponent;
  let fixture: ComponentFixture<GruposProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GruposProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GruposProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
