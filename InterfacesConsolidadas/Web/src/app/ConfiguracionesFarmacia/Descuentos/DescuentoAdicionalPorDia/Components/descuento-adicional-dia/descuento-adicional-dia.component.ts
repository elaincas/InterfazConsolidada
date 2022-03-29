import { Component, OnInit, Output, Input, EventEmitter, AfterViewInit, OnChanges, SimpleChanges } from "@angular/core";
import { DescuentoAdicionalConfiguracion, DescuentoAdicionalConfiguracionConsulta } from "../../../Models/DescuentoAdicionalConfiguracion";
import { DescuentoAdicionalService } from "../../Services/descuento-adicional-dia.service";
import notify from 'devextreme/ui/notify';
import { LoginService } from "../../../../../login/services/login.service";
import { Alertas } from "../../../../../helpers/notificaciones/notificaciones";

@Component({
    selector: 'app-descuento-adicional-dia',
    templateUrl: './descuento-adicional-dia.component.html',
    styleUrls: ['./descuento-adicional-dia.component.css'],
    providers: [DescuentoAdicionalService]
})
export class DescuentoAdicionalPorDiaComponent implements OnInit, OnChanges {
    constructor(
        private descuentosService: DescuentoAdicionalService,
        private loginService: LoginService
    ) {
        this.configuracion = new DescuentoAdicionalConfiguracion();
        this.listadoDescuentos = [];
        this.diasSemana = [];
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.iniciarModoEdicion();
    }

    @Input() configuracionEditar: DescuentoAdicionalConfiguracionConsulta;
    @Output() onActualizarDescuento: EventEmitter<any> = new EventEmitter();
    configuracion: DescuentoAdicionalConfiguracion;
    listadoDescuentos: Array<DescuentoAdicionalConfiguracionConsulta>;
    diasSemana: any[];
    modoEdicion: boolean = false;

    ngOnInit() {
        this.CargarDiasSemana();
        this.modoEdicion = this.configuracionEditar !== undefined;
    }

    iniciarModoEdicion() {
        this.modoEdicion = this.configuracionEditar !== undefined;
        if (this.modoEdicion){
            this.configuracion.id = this.configuracionEditar.id;
            this.configuracion.configuracion = this.configuracionEditar.configuracion;
            this.configuracion.descuento = this.configuracionEditar.descuento;
            this.configuracion.esParaTerceraEdad = this.configuracionEditar.esParaTerceraEdad;
        }
    }

    CargarDiasSemana() {
        this.diasSemana = this.descuentosService.getDiasSemana();
    }

    GuardarConfiguracionDeDescuento() {
        if (!this.validarConfiguracionDescuento()) {
            return;
        }
        Alertas.load("Espere un momento por favor");
        this.configuracion.usuarioAgrega = this.loginService.Usuario.id;
        this.descuentosService.GuardarConfiguracionDeDescuento(this.configuracion)
            .subscribe(r => {
                Alertas.close();
                notify({ message: "Descuento guardado exitosamente" }, "success", 3000);
                this.limpiar();
                this.onActualizarDescuento.emit();
            }, error => {
                Alertas.close();
                notify({ message: error._body }, "error", 3000)
            });
    }

    ActualizarConfiguracionDeDescuento() {
        if (!this.validarConfiguracionDescuento()) {
            return;
        }
        Alertas.load("Espere un momento por favor");
        this.configuracion.usuarioModifica = this.loginService.Usuario.id;
        this.descuentosService.ActualizarConfiguracionDeDescuento(this.configuracion)
            .subscribe(r => {
                Alertas.close();
                notify({ message: "Descuento actualizado exitosamente" }, "success", 3000)
                this.limpiar();
                this.onActualizarDescuento.emit();
            }, error => {
                Alertas.close();
                notify({ message: error._body }, "error", 3000)
            });
    }

    validarConfiguracionDescuento() {
        if (this.configuracion.descuento <= 0) {
            notify({ message: "El descuento no puede ser 0" }, "error", 3000)
            return false;
        }
        if (this.configuracion.configuracion === "") {
            notify({ message: "Debe seleccionar un día" }, "error", 3000)
            return false;
        }
        return true;
    }

    limpiar() {
        this.configuracion = new DescuentoAdicionalConfiguracion();
        this.modoEdicion = false;
    }
}