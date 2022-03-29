import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelResultadoComponent } from './nivel-resultado.component';

describe('NivelResultadoComponent', () => {
  let component: NivelResultadoComponent;
  let fixture: ComponentFixture<NivelResultadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NivelResultadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelResultadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
