import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCuponesComponent } from './lista-cupones.component';

describe('ListaCuponesComponent', () => {
  let component: ListaCuponesComponent;
  let fixture: ComponentFixture<ListaCuponesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaCuponesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaCuponesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
