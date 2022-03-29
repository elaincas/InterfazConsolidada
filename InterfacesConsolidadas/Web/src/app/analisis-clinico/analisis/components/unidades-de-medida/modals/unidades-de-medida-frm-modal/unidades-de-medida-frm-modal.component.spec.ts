import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnidadesDeMedidaFrmModalComponent } from './unidades-de-medida-frm-modal.component';

describe('UnidadesDeMedidaFrmModalComponent', () => {
  let component: UnidadesDeMedidaFrmModalComponent;
  let fixture: ComponentFixture<UnidadesDeMedidaFrmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnidadesDeMedidaFrmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnidadesDeMedidaFrmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
