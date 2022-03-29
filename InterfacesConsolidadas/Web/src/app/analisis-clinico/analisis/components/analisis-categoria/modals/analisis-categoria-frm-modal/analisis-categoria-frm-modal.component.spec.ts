import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisisCategoriaFrmModalComponent } from './analisis-categoria-frm-modal.component';

describe('AnalisisCategoriaFrmModalComponent', () => {
  let component: AnalisisCategoriaFrmModalComponent;
  let fixture: ComponentFixture<AnalisisCategoriaFrmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalisisCategoriaFrmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisisCategoriaFrmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
