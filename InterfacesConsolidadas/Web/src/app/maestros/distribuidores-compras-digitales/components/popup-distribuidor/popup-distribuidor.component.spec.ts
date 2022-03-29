import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupDistribuidorComponent } from './popup-distribuidor.component';

describe('PopupDistribuidorComponent', () => {
  let component: PopupDistribuidorComponent;
  let fixture: ComponentFixture<PopupDistribuidorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopupDistribuidorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupDistribuidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
