import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainLoaderComponent } from './main-loader.component';

describe('MainLoaderComponent', () => {
  let component: MainLoaderComponent;
  let fixture: ComponentFixture<MainLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
