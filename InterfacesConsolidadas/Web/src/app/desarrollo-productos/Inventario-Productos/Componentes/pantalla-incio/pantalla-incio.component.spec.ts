import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaIncioComponent } from './pantalla-incio.component';

describe('PantallaIncioComponent', () => {
  let component: PantallaIncioComponent;
  let fixture: ComponentFixture<PantallaIncioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PantallaIncioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PantallaIncioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
