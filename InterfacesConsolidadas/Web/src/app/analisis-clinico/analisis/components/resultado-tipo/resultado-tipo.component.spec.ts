import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoTipoComponent } from './resultado-tipo.component';

describe('ResultadoTipoComponent', () => {
  let component: ResultadoTipoComponent;
  let fixture: ComponentFixture<ResultadoTipoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultadoTipoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoTipoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
