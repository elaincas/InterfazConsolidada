import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualesComponent } from './individuales.component';

describe('IndividualesComponent', () => {
  let component: IndividualesComponent;
  let fixture: ComponentFixture<IndividualesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndividualesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
