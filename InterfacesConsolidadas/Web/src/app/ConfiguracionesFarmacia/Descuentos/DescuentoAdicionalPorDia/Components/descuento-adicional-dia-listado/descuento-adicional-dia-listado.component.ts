import { Component, Input, OnInit } from "@angular/core";
import { DescuentoAdicionalConfiguracionConsulta, DescuentoAdicionalConfiguracion } from "../../../Models/DescuentoAdicionalConfiguracion";
import { DescuentoAdicionalService } from "../../Services/descuento-adicional-dia.service";
import { LoginService } from "../../../../../login/services/login.service";
import notify from "devextreme/ui/notify";
import { Alertas } from "../../../../../helpers/notificaciones/notificaciones";

@Component({
    selector: 'app-descuento-adicional-dia-listado',
    templateUrl: './descuento-adicional-dia-listado.component.html',
})

export class ListadoDescuentoAdicionalPorDiaComponent implements OnInit {
    constructor(
        private descuentosService: DescuentoAdicionalService,
        private loginService: LoginService
    ) {
        this.mostrarTodos = true;
    }
    @Input() listadoDescuentos: any[];
    @Input() mostrarTodos: boolean;
    @Input() mostrarPopUp: boolean;

    top: number = 0;
    popupVisible = false;
    configuracionEditar: DescuentoAdicionalConfiguracionConsulta;

    ngOnInit(): void {
        if (this.mostrarTodos){
            this.ObtenerDescuentos();
        }
    }

    ObtenerDescuentos() {
        Alertas.load("Espere un momento por favor");
        this.descuentosService.ObtenerDescuentosConfigurados(this.top)
            .subscribe(r => {
                this.listadoDescuentos = r;
                Alertas.close();
            });
    }

    EliminarConfiguracionDeDescuento(descuento: DescuentoAdicionalConfiguracionConsulta) {
        Alertas.question(`Eliminar Descuento`, '¿Está seguro que desea eliminar este descuento?')
            .then(() => {
                this.descuentosService.EliminarConfiguracionDeDescuento(this.loginService.Usuario.id, descuento.id)
                    .subscribe(r => {
                        notify({ message: "Descuento eliminado exitosamente" }, "success", 3000)
                        this.eliminarDeListado(descuento);
                    }, error => {
                        notify({ message: error._body }, "error", 3000)
                        
                    });
            })
    }

    onEditar(configuracion) {
        this.configuracionEditar = configuracion;
        this.popupVisible = !this.popupVisible;
    }

    eliminarDeListado(descuentoEliminar) {
        var index = this.listadoDescuentos.indexOf(descuentoEliminar);
        if (index >= 0) {
            this.listadoDescuentos.splice(index, 1);
        }
    }

    validarConfiguracionDescuento(configuracion) {
        if (configuracion.descuento <= 0) {
            notify({ message: "El descuento no puede ser 0" }, "error", 3000)
            return false;
        }
        if (configuracion.configuracion === "") {
            notify({ message: "Debe seleccionar un día" }, "error", 3000)
            return false;
        }
        return true;
    }

    onPopUpClosed(){
        this.popupVisible = false;
    }

    onActualizarDescuento(boolean) {
        this.ObtenerDescuentos();
        this.popupVisible = false;
    }
}