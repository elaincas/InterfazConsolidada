import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { helpers } from '../../../../helpers/utils';
import { MensajesGenericosStickers } from '../../helpers/mensajes';
import { StickerConfiguracion } from '../../models/stickerConfiguracion.model';
import { StickersService } from '../../services/stickers.service';

@Component({
  selector: 'app-listado-stickers',
  templateUrl: './listado-stickers.component.html',
  styleUrls: ['./listado-stickers.component.css']
})
export class ListadoStickersComponent implements OnInit {
  data: StickerConfiguracion[];
  mensaje = MensajesGenericosStickers;

  cargandoVisible: boolean;

  mensajeLoader: string;

  constructor(
    private _stickersService: StickersService,
    private router: Router,
  ) {
    this.cargandoVisible = true;
    this.mensajeLoader = helpers.cargando;
   }

  ngOnInit() {
    this.cargandoVisible = false;
    this.cargarGrid();
  }

  cargarGrid(){
    this._stickersService.obtenerConfiguracionDeStickers().subscribe(res => {
      this.data = res.data;
    })
  }

  actualizarGrid(onComplete?: Function): void {
    Alertas.load();
    this._stickersService.obtenerConfiguracionDeStickers().subscribe({
      next: (respuesta) => {
        Alertas.close();
        this.data = respuesta.data;
      },
      error: (error) => {
        helpers.procesarError(error);
      },
      complete: () => {
        Alertas.close();
        if (onComplete) {
          onComplete();
        }
      },
    });
  }

  inactivar(id: number) {
    Alertas.question("", "¿Desea inactivar este registro?").then(() => {
      Alertas.load();
      this._stickersService.inactivar(id).subscribe(
        (respuesta) => {
          if (respuesta.data) {
            this.data =
              this.data.map((registro) => {
                if (registro.id === id) {
                  registro.activo = false;
                  return registro;
                }
                return registro;
              });
            Alertas.close();
            Alertas.ok(
              "¡Correcto!",
              "El registro se ha inactivado correctamente."
            );
          } else {
            Alertas.error("Error", "Hubo un error al inactivar el registro.");
          }
        },
        (error) => {
          helpers.procesarError(error);
        }
      );
    });
  }

  obtenerValoresParaActualizar(data: StickerConfiguracion) {
    this.router.navigate([`/maestros/stickers/configuracion/${data.id}`]);
  }

  configurarNuevoSticker() {
    this.router.navigate([`/maestros/stickers/configuracion`]);
  }

  activar(id: number) {
    Alertas.load();
    this._stickersService.activar(id).subscribe(
      (respuesta) => {
        if (respuesta.data) {
          this.data =
            this.data.map((registro) => {
              if (registro.id === id) {
                registro.activo = true;
                return registro;
              }
              return registro;
            });
          Alertas.close();
          Alertas.ok("¡Correcto!", "El registro se ha activado correctamente.");
        } else {
          Alertas.error("Error", "Hubo un error al activar el registro.");
        }
      },
      (error) => {
        helpers.procesarError(error);
      }
    );
  }

}
