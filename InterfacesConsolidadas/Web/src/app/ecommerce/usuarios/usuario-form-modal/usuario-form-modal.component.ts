import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UsuariosService } from '../usuarios.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Alertas } from '../../../helpers/notificaciones/notificaciones';

@Component({
  selector: 'app-usuario-form-modal',
  templateUrl: './usuario-form-modal.component.html',
  styleUrls: ['./usuario-form-modal.component.css']
})
export class UsuarioFormModalComponent implements OnInit {
  tieneDocumentos: boolean = false;
  visible: boolean;
  usuarioForm: FormGroup;
  usuario: any;
  codigosUsuario: any;
  visibleCodigoPopup = false;
  @Output() onGuardar: EventEmitter<any> = new EventEmitter();

  constructor(private usuarioService: UsuariosService) { }
  ngOnInit() {
    let datosPersonales = new FormGroup({
      nombre: new FormControl(''),
      identidadConfirmada: new FormControl(''),
      noIdentidad: new FormControl(''),
      celular: new FormControl(''),
      celularConfirmado: new FormControl('')
    });

    this.usuarioForm = new FormGroup({
      id: new FormControl(''),
      correoElectronico: new FormControl(''),
      bloqueado: new FormControl(''),
      envioRecargasHabilitado: new FormControl(''),
      activo: new FormControl(''),
      datosPersonales: datosPersonales
    });

    this.registrarEventos();
  }
  obtenercodigos() {
    this.visibleCodigoPopup = true;
    this.usuarioService.obtenerCodigos(this.usuario.id).subscribe(data => {
      this.codigosUsuario = data;
    }, error => {
      Alertas.showHttpResponse(error);
    });
  }

  registrarEventos() {
    this.usuarioForm.get('bloqueado').valueChanges.subscribe(seleccionado => {
      if (!seleccionado) {
        return;
      }

      this.usuarioForm.get('envioRecargasHabilitado').setValue(false);
      this.usuarioForm.get('datosPersonales.identidadConfirmada').setValue(false);
      this.usuarioForm.get('datosPersonales.celularConfirmado').setValue(false);
      this.usuarioForm.get('activo').setValue(false);
    });

    this.usuarioForm.get('datosPersonales.identidadConfirmada').valueChanges.subscribe(seleccionado => {
      if (!seleccionado) {
        this.usuarioForm.get('envioRecargasHabilitado').setValue(false);
        return;
      }

      this.usuarioForm.get('envioRecargasHabilitado').setValue(true);
      this.usuarioForm.get('bloqueado').setValue(false);
    });
  }


  public cargarUsuario(usuarioId: number) {
    Alertas.load()
    this.usuarioService.obtenerUsuario(usuarioId).subscribe(data => {
      Alertas.close();
      console.log(data);

      this.usuarioForm.patchValue(data);
      this.usuarioForm.get('envioRecargasHabilitado').setValue(data.envioRecargasHabilitado);
      this.visible = true;
      this.usuario = data;
      this.tieneDocumentos = this.usuario.datosPersonales.documentos.length > 0;
    });
  }

  public guardar() {
    Alertas.load();
    let usuario = this.usuarioForm.value
    let agente = JSON.parse(localStorage.getItem("auth"))
    let idAgente = agente.id

    this.usuarioService.actualizar(usuario,idAgente).subscribe(() => {
      Alertas.close();
      this.visible = false;
      this.onGuardar.emit();
    });
  }

  public eliminarDocumentos() {
    Alertas.question(``, '¿Está seguro de que desea eliminar los documento de este usuario?')
      .then(() => {
      this.usuarioService.eleimnarDocumentosUsuario(this.usuario.id).subscribe(() => {
        this.visible = false;
      });
    });
  }

  reembiarCodigoDeActivacion(): void {
    Alertas.load();
    this.usuarioService.reenviarCodigoDeConfirmacion(this.usuario).subscribe(data => {
      Alertas.close();
      Alertas.ok("", "Código de activación enviado");
    }, error => {
      Alertas.showHttpResponse(error);
    });
  }
  eliminarUsuario(): void {
    Alertas.question(``, '¿Está seguro de que desea eliminar este usuario?')
    .then(() => {
 
      Alertas.load();
      this.usuarioService.eliminarUsuario(this.usuario.id).subscribe(data => {
        Alertas.close();
        Alertas.ok("", "Usuario Eliminado");
      }, error => {
        Alertas.showHttpResponse(error);
      });
    });
  }

  confirmarUsuario(): void {
    Alertas.load();
    this.usuarioService.confirmarUsuario(this.usuario).subscribe(data => {
      Alertas.close()
      this.cargarUsuario(this.usuario.id);
    }, error => {
      Alertas.showHttpResponse(error);
    });
  }

}
