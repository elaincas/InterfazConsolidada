import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariablesDeConfiguracionComponent } from './variables-de-configuracion.component';

describe('VariablesDeConfiguracionComponent', () => {
  let component: VariablesDeConfiguracionComponent;
  let fixture: ComponentFixture<VariablesDeConfiguracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariablesDeConfiguracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariablesDeConfiguracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
