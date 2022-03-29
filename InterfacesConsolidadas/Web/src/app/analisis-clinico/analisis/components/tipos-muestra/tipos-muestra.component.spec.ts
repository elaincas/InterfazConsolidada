import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposMuestraComponent } from './tipos-muestra.component';

describe('TiposMuestraComponent', () => {
  let component: TiposMuestraComponent;
  let fixture: ComponentFixture<TiposMuestraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiposMuestraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposMuestraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
