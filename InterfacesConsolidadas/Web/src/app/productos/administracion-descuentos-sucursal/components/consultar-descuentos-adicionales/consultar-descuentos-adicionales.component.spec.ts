import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarDescuentosAdicionalesComponent } from './consultar-descuentos-adicionales.component';

describe('ConsultarDescuentosAdicionalesComponent', () => {
  let component: ConsultarDescuentosAdicionalesComponent;
  let fixture: ComponentFixture<ConsultarDescuentosAdicionalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultarDescuentosAdicionalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarDescuentosAdicionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
