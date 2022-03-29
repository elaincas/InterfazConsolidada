import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioFormModalComponent } from './usuario-form-modal.component';

describe('UsuarioFormModalComponent', () => {
  let component: UsuarioFormModalComponent;
  let fixture: ComponentFixture<UsuarioFormModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioFormModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
