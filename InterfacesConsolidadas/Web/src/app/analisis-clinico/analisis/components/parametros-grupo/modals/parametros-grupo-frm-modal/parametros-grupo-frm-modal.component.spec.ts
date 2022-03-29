import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosGrupoFrmModalComponent } from './parametros-grupo-frm-modal.component';

describe('ParametrosGrupoFrmModalComponent', () => {
  let component: ParametrosGrupoFrmModalComponent;
  let fixture: ComponentFixture<ParametrosGrupoFrmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametrosGrupoFrmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosGrupoFrmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
