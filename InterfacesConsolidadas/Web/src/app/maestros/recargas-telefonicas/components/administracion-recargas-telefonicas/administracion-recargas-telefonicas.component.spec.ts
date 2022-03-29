import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionRecargasTelefonicasComponent } from './administracion-recargas-telefonicas.component';

describe('AdministracionRecargasTelefonicasComponent', () => {
  let component: AdministracionRecargasTelefonicasComponent;
  let fixture: ComponentFixture<AdministracionRecargasTelefonicasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministracionRecargasTelefonicasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionRecargasTelefonicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
