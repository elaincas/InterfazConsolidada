import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitosFrmComponent } from './requisitos-frm.component';

describe('RequisitosFrmComponent', () => {
  let component: RequisitosFrmComponent;
  let fixture: ComponentFixture<RequisitosFrmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequisitosFrmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitosFrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
