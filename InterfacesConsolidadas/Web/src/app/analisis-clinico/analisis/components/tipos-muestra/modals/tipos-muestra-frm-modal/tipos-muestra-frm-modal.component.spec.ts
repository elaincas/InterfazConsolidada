import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposMuestraFrmModalComponent } from './tipos-muestra-frm-modal.component';

describe('TiposMuestraFrmModalComponent', () => {
  let component: TiposMuestraFrmModalComponent;
  let fixture: ComponentFixture<TiposMuestraFrmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiposMuestraFrmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposMuestraFrmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
