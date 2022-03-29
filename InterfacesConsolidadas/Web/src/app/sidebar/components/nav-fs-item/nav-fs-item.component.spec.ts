import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavFsItemComponent } from './nav-fs-item.component';

describe('NavFsItemComponent', () => {
  let component: NavFsItemComponent;
  let fixture: ComponentFixture<NavFsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavFsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavFsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
