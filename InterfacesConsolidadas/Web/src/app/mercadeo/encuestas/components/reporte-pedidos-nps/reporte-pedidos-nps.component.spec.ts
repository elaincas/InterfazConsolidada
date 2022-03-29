import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePedidosNpsComponent } from './reporte-pedidos-nps.component';

describe('ReportePedidosNpsComponent', () => {
  let component: ReportePedidosNpsComponent;
  let fixture: ComponentFixture<ReportePedidosNpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportePedidosNpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportePedidosNpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
