import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionSalidaComponent } from './informacion-salida.component';

describe('InformacionSalidaComponent', () => {
  let component: InformacionSalidaComponent;
  let fixture: ComponentFixture<InformacionSalidaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionSalidaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionSalidaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
