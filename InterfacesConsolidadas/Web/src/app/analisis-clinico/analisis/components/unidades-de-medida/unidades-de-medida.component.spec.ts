import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadesDeMedidaComponent } from './unidades-de-medida.component';

describe('UnidadesDeMedidaComponent', () => {
  let component: UnidadesDeMedidaComponent;
  let fixture: ComponentFixture<UnidadesDeMedidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnidadesDeMedidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadesDeMedidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
