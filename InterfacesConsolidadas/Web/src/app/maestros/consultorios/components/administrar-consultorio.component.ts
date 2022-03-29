import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';
import { validateConfig } from '@angular/router/src/config';
import { isNullOrUndefined } from 'util';

import { Alertas } from '../../../helpers/notificaciones/notificaciones';
import { LoginService } from '../../../login/services/login.service';
import { isNullEmptyOrWhiteSpace } from '../../../productos/administracion-alternativos/services/administracionProductosAlternativos.service';
import { Consultorio } from '../models/consultorio.model';
import { ConsultorioMedico } from '../models/consultorioMedico.model';
import { Medico } from '../models/medico.model';
import { ConsultorioService } from '../services/administrar-consultorio.service';



@Component({
    selector: 'app-consultorio',
    templateUrl: './administrar-consultorio.component.html',

})

export class ConsultorioAdmin implements OnInit {
    medicos: Medico[];
    consultorios: Consultorio[]
    consultorioMedicos: ConsultorioMedico[]
    consultorioMedico: ConsultorioMedico;
    consultorio: Consultorio;
    desactivarCampoConsultorio: boolean = false;
    editarConsultorio: boolean = false;
    HorarioLVDesde: number = 0
    HorarioLVHasta: number = 0
    HorarioSabadoDesde: number = 0
    HorarioSabadoHasta: number = 0
    HorarioDomingoDesde: number = 0
    HorarioDomingoHasta: number = 0
    _mostrarPopup: boolean = false;
    nombreConsultorioPopup: string = "";
    editarMedico : boolean = false;
    /**
     *
     */
    constructor(private service: ConsultorioService, private loginService: LoginService) {
        this.medicos = [];
        this.consultorioMedicos = [];
        this.consultorios = [];
        this.consultorioMedico = new ConsultorioMedico();
        this.consultorio = new Consultorio();
        this.Limpiar();
    }

    ngOnInit(): void {
        this.ObtenerMedicos();
        this.ObtenerConsultorios();
    }

    ObtenerConsultorios() {
        this.service.ObtenerConsultorios().subscribe(data => {
            this.consultorios = data
        })
    }
    ObtenerMedicos() {
        this.service.ObtenerMedicos().subscribe(data => {
            this.medicos = data
        })

    }
    ObtenerMedicosPorConsultorio() {
        this.service.ObtenerMedicosConsultorio(this.consultorioMedico.ConsultorioId).subscribe(data => {
            this.consultorioMedicos = data;
        })
    }
    IngresarConsultorio() {
        
        if (!this.ValidarConsultorio()) {
            return;
        }
        if (this.editarConsultorio == true) {
            this.ActualizarConsultorio();
            this.ObtenerConsultorios();
            return;
        }

        this.service.AgregarConsultorio(this.consultorio).subscribe(data => {
            Alertas.ok();
            this.Limpiar();
            this.ObtenerConsultorios();
        },error=>{
            Alertas.error();
        });

    }
    Limpiar() {
        this.consultorio = new Consultorio();
        this.consultorioMedico = new ConsultorioMedico();
        this.consultorio.UsuarioAgregaId = this.loginService.Usuario.id.toString();
        this.consultorioMedico.UsuarioAgregaId = this.loginService.Usuario.id.toString();
        this.HorarioSabadoHasta = 0
        this.HorarioSabadoDesde = 0;
        this.HorarioLVHasta = 0;
        this.HorarioLVDesde = 0;
        this.HorarioDomingoHasta = 0;
        this.HorarioDomingoDesde = 0;
        this.editarConsultorio = false;

    }
    ValidarConsultorio(): boolean {
        if (isNullEmptyOrWhiteSpace(this.consultorio.Direccion) || this.consultorio.Direccion.length < 10) {
            Alertas.warning("Advertencia", "Favor ingrese una dirección valida")
            return false;
        }
        if (isNullEmptyOrWhiteSpace(this.consultorio.Email) || this.consultorio.Email.length < 10) {
            Alertas.warning("Advertencia", "Favor ingrese un Email valido")
            return false;
        }
        if (isNullEmptyOrWhiteSpace(this.consultorio.Especialidad) || this.consultorio.Especialidad.length < 10) {
            Alertas.warning("Advertencia", "Favor ingrese un Especialidad valida")
            return false;
        }
        if (isNullEmptyOrWhiteSpace(this.consultorio.HorarioLunesViernes)) {
            Alertas.warning("Advertencia", "Favor ingrese un horario valido de L-V")
            return false;
        }
        if (isNullEmptyOrWhiteSpace(this.consultorio.HorarioSabado)) {
            Alertas.warning("Advertencia", "Favor ingrese un horario valido para sábados")
            return false;
        }
  
        if (isNullEmptyOrWhiteSpace(this.consultorio.Medico)) {
            Alertas.warning("Advertencia", "Favor ingrese un nombre de Médico valido para el consultorio")
            return false;
        }
        if (isNullEmptyOrWhiteSpace(this.consultorio.Nombre)) {
            Alertas.warning("Advertencia", "Favor ingrese un nombre de consultorio valido ")
            return false;
        }
        if (isNullEmptyOrWhiteSpace(this.consultorio.Telefono)) {
            Alertas.warning("Advertencia", "Favor ingrese un teléfono valido ")
            return false;
        }
        return true;
    }

    IngresarMedicoAConsultorio() {

        if (!this.ValidarMedicoConsultorio()) {
            return;
        }


        this.service.AgregarMedicoConsultorio(this.consultorioMedico).subscribe(data => {
            Alertas.ok()
            this.Limpiar();
        })

    }

    ValidarMedicoConsultorio(): boolean {
        if (isNullOrUndefined(this.consultorioMedico.ConsultorioId) || this.consultorioMedico.ConsultorioId == 0) {
            Alertas.warning("Advertencia", "Elija un consultorio");
            return false;
        }
        if (isNullOrUndefined(this.consultorioMedico.MedicoId) || this.consultorioMedico.MedicoId == 0) {
            Alertas.warning("Advertencia", "Elija un médico");
            return false;
        }
        return true;
    }
    ActualizarConsultorio(eliminarConsultorio: boolean = false) {
        if (eliminarConsultorio) {
            this.consultorio.Activo = false;
        }
        if (!this.ValidarConsultorio()) {
            return;
        }
        this.service.ModificarConsultorio(this.consultorio).subscribe(data => {
            Alertas.ok();
            this.Limpiar();
        })

    }
    ActualizarMedicoAConsultorio(eliminarMedicoConsultorio: boolean = false) {
        if (eliminarMedicoConsultorio) {
            this.consultorioMedico.Activo = false;

        }
        if (!this.ValidarMedicoConsultorio()) {
            return;
        }
        
        this.service.ModificarMedicoConsultorio(this.consultorioMedico).subscribe(data => {
            Alertas.ok();
            this.Limpiar();
        })
    }
    EditarConsultorio(data) {
        debugger;
        this.editarConsultorio = true;
        this.consultorio.Email = data.email;
        this.consultorio.Especialidad = data.especialidad;
        this.consultorio.Id = data.id;
        this.consultorio.Medico = data.medico;
        this.consultorio.Nombre = data.nombre;
        this.consultorio.Telefono = data.telefono;
        this.consultorio.Direccion = data.direccion;
        this.consultorio.HorarioDomingo = data.horadioDomingo;
        this.consultorio.HorarioSabado = data.horarioSabado;
        this.consultorio.HorarioLunesViernes= data.horarioLunesViernes;
    }
    EliminarConsultorio(data) {
        this.consultorio.Id = data.id;
        this.editarConsultorio = true;
        this.EditarConsultorio(true);
    }

    MostrarMedicos(data) {
        this._mostrarPopup = true;
        this.consultorioMedico.ConsultorioId = data.id;
        this.nombreConsultorioPopup = data.nombre;
        this.ObtenerMedicosPorConsultorio();
    }
    Salir() {
        this.consultorioMedico = new ConsultorioMedico();
        this.editarMedico = false;
        this._mostrarPopup = false;
    }
    EliminarMedico(data){
        debugger;
        this.editarMedico = true;
        this.consultorioMedico.Id = data.consultoMedicoId;
        this.consultorioMedico.MedicoId = data.medicoId;
        this.ActualizarMedicoAConsultorio (true);
        
    }
    AgregarMedico(){
        this.IngresarMedicoAConsultorio ();
    }
}