import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosFrmComponent } from './parametros-frm.component';

describe('ParametrosFrmComponent', () => {
  let component: ParametrosFrmComponent;
  let fixture: ComponentFixture<ParametrosFrmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametrosFrmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosFrmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
