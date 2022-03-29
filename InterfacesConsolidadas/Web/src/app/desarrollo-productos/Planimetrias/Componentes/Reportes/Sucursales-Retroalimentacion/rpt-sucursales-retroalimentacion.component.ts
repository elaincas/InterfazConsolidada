import { Component, OnInit } from "../../../../../../../node_modules/@angular/core";
import { RptSucursalesRetroalimentacionService } from "./rpt-sucursales-retroalimentacion.service";
import { Planimetria } from "../../../Clases/Planimetria";
import { Alertas } from "../../../../../helpers/notificaciones/notificaciones";
import { DomSanitizer } from "../../../../../../../node_modules/@angular/platform-browser";
import { Archivos } from "../../../Clases/Archivos";
import { TiposArchivos } from "../../../Clases/EnumArchivo";
import { Alert } from "../../../../../../../node_modules/@types/selenium-webdriver";

@Component({
    selector: 'rpt-sucursales-retroalimentacion',
    templateUrl: './rpt-sucursales-retroalimentacion.component.html',
    styleUrls: ['./rpt-sucursales-retroalimentacion.component.css'],
})

export class RptSucursalesRetroalimentacion implements OnInit {
    usuariosID: number;
    retroalimentaciones = [] as any;
    _mostrarPopup: Boolean = false;
    retroalimentacion: Planimetria;
    tipoPlanimetrias = [];
    sucursales = [];
    fecha = new Date();
    urlImage : Archivos [];
    constructor(private service: RptSucursalesRetroalimentacionService, private sanitizer: DomSanitizer) {
        this.retroalimentacion = new Planimetria();
        this.urlImage = new Array<Archivos>();
        this.ObtenerTiposDePlanimetria();
        this.ObtenerSucursales();
    }
    ngOnInit(): void {
    }
    MostarInformacionArchivosRetroalimentacionSucursal() {
        this.urlImage = [];
        this.BuscarInformacion();
        this.ObtenerImagenesRetroalimentacion();

        this._mostrarPopup = true;
    }
    ObtenerTiposDePlanimetria() {
        this.service.ObtenerTipoPlanimetrias().subscribe(data => {
            this.tipoPlanimetrias = data as any[];
        });
    }
    ObtenerSucursales() {
        this.service.ObtenerSucursales().subscribe(data => {
            this.sucursales = data as any[];
        });
    }
    MostrarPopup(dataEvent) {
        this._mostrarPopup = false;
        this.urlImage = [];
    }
    BuscarInformacion() {
        if (this.validaDatos()) {
            this.service.obtenerInformacion(this.retroalimentacion.TipoPlanimetriaID, this.retroalimentacion.SucursalID, this.retroalimentacion.mesAnio).subscribe(data => {
                this.retroalimentaciones = data as any[];
            });
        }
    }
    ObtenerFecha(data) {
        if (data.value) {
            this.retroalimentacion.mesAnio = (new Date(data.value).getFullYear()).toString() + "/" + (new Date(data.value).getMonth() + 1).toString();;
        }
    }
    validaDatos(): Boolean {
        if (this.retroalimentacion.TipoPlanimetriaID == 0) {
            Alertas.warning("", "Seleccione un tipo de planimetría.");
            return false;
        }
        if (this.retroalimentacion.SucursalID == 0) {
            Alertas.warning("", "Seleccione una sucursal.");
            return false;
        }
        if (this.retroalimentacion.mesAnio == "") {
            Alertas.warning("", "Seleccione un año/mes.");
            return false;
        }
        return true;
    }

    ObtenerItemClick(dataEvent){
        this.retroalimentacion.ArchivoId = dataEvent.addedItems[0].ArchivoId;
    }

    ObtenerImagenesRetroalimentacion() {
        this.service.ObtenerInformacionImagenes(this.retroalimentacion.TipoPlanimetriaID, this.retroalimentacion.SucursalID).subscribe(data => {
            if (data != undefined) {
                
                data.archivos.forEach(element => {

                    let nombre = element.NombreImagen.split('/');
                    let nombreImagen = nombre[2];
                    this.service.ObtenerArchivo(nombreImagen).subscribe(dataImagen => {
                        let blob = new Array(dataImagen);
                        let image: File = new File(blob, "prueba.jpeg", { type: "image/jpeg", lastModified: Date.now() });
                        this.ConvertirImagen(image,element);
                    })
                });
            }
        }, error => {
            Alertas.warning("", error);
        })
    }
    private ConvertirImagen(image,elemento) {
        if (image) {
            this.retroalimentacion.PlanimetriaID = elemento.PlanimetriaID;
            const reader = new FileReader();
            reader.onload = (event: any) => {
                this.urlImage.push(new Archivos(elemento.PlanimetriaID,event.target.result,TiposArchivos.Imagen,"",image,this.usuariosID,elemento.Observaciones,elemento.ArchivoId));
            };
            reader.readAsDataURL(image);
        }
    }
    AprobarAnularPlanimetria(estadoID){
        this.retroalimentacion.EstadoID = estadoID;
        this.usuariosID = this.usuariosID;
        this.service.aprobarPlanimetria(this.retroalimentacion).subscribe(data=>{
            Alertas.ok("", "Éxito");
            this.BuscarInformacion();
        },error=>{
            Alertas.error("",error._body);
        })
    }
    ObtenerArchivo(dataEvent){
        this._mostrarPopup = true;
        this.urlImage = [];
        let nombre = dataEvent.NombreImagen.split('/');
        let nombreImagen = nombre[2];
        this.service.ObtenerArchivo(nombreImagen).subscribe(dataImagen => {
            let blob = new Array(dataImagen);
            let image: File = new File(blob, "prueba.jpeg", { type: "image/jpeg", lastModified: Date.now() });
            this.ConvertirImagen(image,dataEvent);
        })
    }
}