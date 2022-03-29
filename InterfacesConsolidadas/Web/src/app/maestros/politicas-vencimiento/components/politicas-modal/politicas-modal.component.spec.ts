import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticasModalComponent } from './politicas-modal.component';

describe('PoliticasModalComponent', () => {
  let component: PoliticasModalComponent;
  let fixture: ComponentFixture<PoliticasModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PoliticasModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliticasModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
