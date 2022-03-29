import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarDescuentosPopupComponent } from './modificar-descuentos-popup.component';

describe('ModificarDescuentosPopupComponent', () => {
  let component: ModificarDescuentosPopupComponent;
  let fixture: ComponentFixture<ModificarDescuentosPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificarDescuentosPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarDescuentosPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
