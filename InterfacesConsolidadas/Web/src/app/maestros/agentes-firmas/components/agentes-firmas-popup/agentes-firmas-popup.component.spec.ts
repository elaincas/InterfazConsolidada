import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentesFirmasPopupComponent } from './agentes-firmas-popup.component';

describe('AgentesFirmasPopupComponent', () => {
  let component: AgentesFirmasPopupComponent;
  let fixture: ComponentFixture<AgentesFirmasPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgentesFirmasPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgentesFirmasPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
