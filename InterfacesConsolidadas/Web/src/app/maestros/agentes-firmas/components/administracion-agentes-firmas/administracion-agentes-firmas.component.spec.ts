import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionAgentesFirmasComponent } from './administracion-agentes-firmas.component';

describe('AdministracionAgentesFirmasComponent', () => {
  let component: AdministracionAgentesFirmasComponent;
  let fixture: ComponentFixture<AdministracionAgentesFirmasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministracionAgentesFirmasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionAgentesFirmasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
