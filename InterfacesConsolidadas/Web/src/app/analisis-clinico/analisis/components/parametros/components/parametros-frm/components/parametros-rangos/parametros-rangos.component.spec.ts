import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrosRangosComponent } from './parametros-rangos.component';

describe('ParametrosRangosComponent', () => {
  let component: ParametrosRangosComponent;
  let fixture: ComponentFixture<ParametrosRangosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametrosRangosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosRangosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
