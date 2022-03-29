import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisisFrmComponent } from './analisis-frm.component';

describe('AnalisisFrmComponent', () => {
  let component: AnalisisFrmComponent;
  let fixture: ComponentFixture<AnalisisFrmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalisisFrmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisisFrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
