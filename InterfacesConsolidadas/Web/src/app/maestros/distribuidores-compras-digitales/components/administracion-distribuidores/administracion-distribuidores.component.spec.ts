import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionDistribuidoresComponent } from './administracion-distribuidores.component';

describe('AdministracionDistribuidoresComponent', () => {
  let component: AdministracionDistribuidoresComponent;
  let fixture: ComponentFixture<AdministracionDistribuidoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministracionDistribuidoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionDistribuidoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
