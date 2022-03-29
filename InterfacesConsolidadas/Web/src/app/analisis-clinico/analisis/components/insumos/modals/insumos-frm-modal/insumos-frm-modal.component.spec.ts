import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumosFrmModalComponent } from './insumos-frm-modal.component';

describe('InsumosFrmModalComponent', () => {
  let component: InsumosFrmModalComponent;
  let fixture: ComponentFixture<InsumosFrmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsumosFrmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsumosFrmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
