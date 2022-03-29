import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitosFrmModalComponent } from './requisitos-frm-modal.component';

describe('RequisitosFrmModalComponent', () => {
  let component: RequisitosFrmModalComponent;
  let fixture: ComponentFixture<RequisitosFrmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequisitosFrmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitosFrmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
