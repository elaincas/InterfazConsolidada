import { BloqueoDeProcesosComponent } from './../bloqueo-de-procesos/bloqueo-de-procesos.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuariosService } from '../usuarios.service';
import { UsuarioFormModalComponent } from '../usuario-form-modal/usuario-form-modal.component';
import { FormGroup, FormControl } from '@angular/forms';
import { Alertas } from '../../../helpers/notificaciones/notificaciones';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  @ViewChild('usuarioModal') usuarioModal: UsuarioFormModalComponent;
  usuarios: any[];
  filtrosFrm: FormGroup;
  constructor(private usuariosService: UsuariosService) { }

  ngOnInit() {
    this.usuarios = [];
    this.inicializarFiltros();
  }

  inicializarFiltros() {
    this.filtrosFrm = new FormGroup({
      nombre: new FormControl(''),
      apellido: new FormControl(''),
      noIdentidad: new FormControl(''),
      bloqueados: new FormControl(''),
      recargasNoHabilitadas: new FormControl(''),
      identidadConfirmada: new FormControl(''),
      subioDocumentosIdentidad: new FormControl(''),
      correo: new FormControl('')
    })
  }

  cargarUsuarios() {
    Alertas.load();
    let filtros = this.filtrosFrm.value;
    this.usuariosService.obtenerUsuarios(
      filtros.recargasNoHabilitadas,
      filtros.bloqueados,
      filtros.subioDocumentosIdentidad,
      filtros.identidadConfirmada,
      filtros.nombre,
      filtros.apellido,
      filtros.noIdentidad,
      filtros.correo
    )
      .subscribe(data => {
        Alertas.close();
        this.usuarios = data;
      }, error => {
        Alertas.close();
        Alertas.showHttpResponse(error);
      });
  }

  alActualizarUsuario() {
    this.cargarUsuarios();
  }

  editarUsuario(usuario: any) {
    this.usuarioModal.cargarUsuario(usuario.id);
  }
}
