import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarDescuentosAdicionalesComponent } from './agregar-descuentos-adicionales.component';

describe('AgregarDescuentosAdicionalesComponent', () => {
  let component: AgregarDescuentosAdicionalesComponent;
  let fixture: ComponentFixture<AgregarDescuentosAdicionalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarDescuentosAdicionalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarDescuentosAdicionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
