import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosGrupoComponent } from './parametros-grupo.component';

describe('ParametrosGrupoComponent', () => {
  let component: ParametrosGrupoComponent;
  let fixture: ComponentFixture<ParametrosGrupoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametrosGrupoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
