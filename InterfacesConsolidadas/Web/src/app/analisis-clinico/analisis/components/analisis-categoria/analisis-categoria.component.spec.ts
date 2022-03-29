import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalisisCategoriaComponent } from './analisis-categoria.component';

describe('AnalisisCategoriaComponent', () => {
  let component: AnalisisCategoriaComponent;
  let fixture: ComponentFixture<AnalisisCategoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalisisCategoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisisCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
