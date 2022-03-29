import { PedidosRecompraService } from './../../_services/pedidos-recompra.service';
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { PedidoProductoDetalle } from '../../_models/PedidoProductoDetalle';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-pedido-detalle',
  templateUrl: './pedido-detalle.component.html',
  styles: [],
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            style({ opacity: 0 }),
            animate('500ms ease-out',
                    style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            style({  opacity: 1 }),
            animate('200ms ease-in',
                    style({ opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class PedidoDetalleComponent implements OnInit {
  @Input() pedidoProducto: PedidoProductoDetalle;
  @Output() guardarCambios = new EventEmitter();

  verFormularioObservaciones = false;
  formularioObservaciones = {
    pedidoReorderId: 0,
    observaciones: ''
  };

  verFormularioHoraEntrega = false;
  formularioHoraEntrega = {
    productoReorderId: 0,
    time: undefined
  };

  constructor(private pedidosRecompraService: PedidosRecompraService) { }

  ngOnInit() {
  }

  mostrarFormularioObservaciones() {
    this.formularioObservaciones.pedidoReorderId = this.pedidoProducto.pedidoReorderId;
    this.formularioObservaciones.observaciones = this.pedidoProducto.observaciones;
    this.verFormularioObservaciones = true;
  }

  mostrarFormularioHoraEntrega() {
    this.formularioHoraEntrega.productoReorderId = this.pedidoProducto.productoReorderId;
    this.formularioHoraEntrega.time = this.pedidoProducto.horaPrefiereEntrega;
    this.verFormularioHoraEntrega = true;
  }

  guardarCambiosFormularioObservaciones() {
    Alertas.load();
    this.pedidosRecompraService.EditarObservacionesDePedido(this.formularioObservaciones)
      .subscribe(r => {
        setTimeout(() => {
          Alertas.close();
        this.guardarCambios.emit();
        }, 2000);
        Alertas.ok('¡Éxito!', r.mensaje);
        this.pedidoProducto.observaciones = this.formularioObservaciones.observaciones;
        this.verFormularioObservaciones = false;
      }, error => {
        Alertas.close();
        Alertas.showHttpResponse(error, '¡Error!', false);
      });
  }

  guardarCambiosFormularioHoraEntrega() {
    Alertas.load();
    this.pedidosRecompraService.EditarHoraEntregaDePedido(this.formularioHoraEntrega)
      .subscribe(r => {
        setTimeout(() => {
          Alertas.close();
          this.guardarCambios.emit();
        }, 2000);
        Alertas.ok('¡Éxito!', r.mensaje);
        this.pedidoProducto.horaPrefiereEntrega = this.formularioHoraEntrega.time;
        this.verFormularioHoraEntrega = false;
      }, error => {
        Alertas.close();
        Alertas.showHttpResponse(error, '¡Error!', false);
      });
  }
}
