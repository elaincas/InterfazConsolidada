import { OnInit, Component, ViewChild } from "@angular/core";
import { ServiciosProporcionadosService } from "../services/ServiciosProporcionados.service";
import { Notificaciones } from "../../../entrenamiento/administracion-productos/helpers/notificaciones/notificacion";
import { Alertas } from "../../../helpers/notificaciones/notificaciones";
import { Seccion } from "../models/Seccion";
import { Servicio } from "../models/Servicio";
import { addServicio } from "../models/addServicio";
import { LoginService } from "../../../login/services/login.service";
import { Columna } from "../models/Columna";
import { ContenidoTipo } from "../models/ContenidoTipo";
import { Router } from "@angular/router";
import { DxSelectBoxComponent, DxTextBoxComponent } from "devextreme-angular";
import { ServicioDetalle } from "../models/ServicioDetalle";

@Component({
    selector: 'app-lista-servicios',
    templateUrl: './lista-servicios.component.html',
    styleUrls: ['./lista-servicios.component.css'],
    providers: [ServiciosProporcionadosService, LoginService]
})
export class ListaServiciosComponent implements OnInit {
    constructor(private service: ServiciosProporcionadosService,
        private loginService: LoginService,
        private router: Router) {
        this.nuevoServicio = new addServicio();
        this.tipoContenido = new ContenidoTipo();
        this.detalleSubtitulo1 = new ServicioDetalle();
        this.detalleSubtitulo2 = new ServicioDetalle();
        this.detalleTitulo = new ServicioDetalle();
    }
    // Control
    mostrarPopUpServicio: boolean = false;
    mostrarPopUpSeccion: boolean = false;
    mostrarPopUpColumna: boolean = false;
    mostrarImagenSeccion = false;
    mostrarTextoSeccion = false;
    mostrarVideoEnlaceSeccion = false;
    mostrarListaSeccion = false;
    Tipo: number;
    minDate: Date = new Date(Date.now());
    nuevaColumna = false;
    txtEditarElementoLista: string = '';
    editandoContenido: boolean = false;
    contenido: string = '';
    mostrarPopUpOrdenarListaSecciones: boolean = false;
    mostrarPopUpOrdenarLista: boolean = false;
    // *** DXFile
    urlIconoSeccion: string = '';
    urlIconoMovil: string = '';
    urlIconoWeb: string = '';
    urlContenido: string = '';
    //Modelos
    ServicioEditar: Servicio;
    SeccionEditar: Seccion;
    ColumnaEditar: Columna;
    tiposSecciones: ContenidoTipo[];
    tipoContenido: ContenidoTipo;
    listado: string = '';
    nuevoServicio: addServicio;
    detalleTitulo: ServicioDetalle;
    detalleSubtitulo1: ServicioDetalle;
    detalleSubtitulo2: ServicioDetalle;
    columnaAcargar: Columna;
    // Listas
    listadoServicios: any[] = [];
    listadoSeccionesOrdenar: any[] = [];
    itemsListaOrdenar: any[] = [];
    //Controles
    @ViewChild('lueTipoContenido')
    lueTipoContenido: DxSelectBoxComponent;

    @ViewChild('txtTextoListado')
    txtTextoListado: DxTextBoxComponent;

    ngOnInit() {
        this.ObtenerServicios();
        this.obtenerSeccionesTipos();
    }

    CargarServicios() { 
        this.ObtenerServicios();
        this.obtenerSeccionesTipos();     
    }
    

    ObtenerServicios() {
        Alertas.load("Espere un momento por favor", "")
        this.service.ObtenerListadoServicios().subscribe(r => {
            Alertas.close();
            this.listadoServicios = r;
            console.log(r);
        }, e => {
            Alertas.error("Ocurrió un error", "No fue posible obtener el listado");
        });
    }

    obtenerSeccionesTipos() {
        this.service.ObtenerSeccionesTipos().subscribe(r => {
            this.tiposSecciones = r;
            this.tipoContenido.id = 0;
        });
    }

    EditarServicio(servicio) {
        this.router.navigate(['ecommerce/servicios/editar/', servicio.servicioId]);
    }

    onEditarServicio() {
        var listaDetalles = [];
        listaDetalles.push(this.detalleTitulo);
        listaDetalles.push(this.detalleSubtitulo1);
        listaDetalles.push(this.detalleSubtitulo2);
        this.ServicioEditar.detalles = listaDetalles;
        this.service.EditarServicio(this.ServicioEditar, this.loginService.Usuario.id)
            .subscribe(r => {
                this.mostrarPopUpServicio = !this.mostrarPopUpServicio;
                this.ServicioEditar.iconoMovilUrl = r.iconoMovilUrl;
                this.ServicioEditar.iconoWebUrl = r.iconoWebUrl;
                Alertas.ok("¡Correcto!",  "Los datos han sido actualizados")
                this.ObtenerServicios();
            }, error => {
                Alertas.error("Ocurrió un error actualizar los datos del Servicio");
            });
    }

    EliminarServicio(servicio) {
        Alertas.question("Eliminar Servicio", "¿Está seguro de querer eliminar este Servicio?")
            .then(r => {
                var indexServicio = this.listadoServicios.indexOf(servicio);
                this.service.DesactivarServicio(servicio.servicioId, this.loginService.Usuario.id)
                    .subscribe(r => {
                        this.listadoServicios.splice(indexServicio, 1);
                        Notificaciones.error("El servicio fue eliminado");
                    }, error => {
                        Alertas.error("Ocurrió un error al intentar eliminar el Servicio");
                    });
            });
    }

    EditarSeccion(seccion) {
        setTimeout(() => {
            this.mostrarPopUpSeccion = !this.mostrarPopUpSeccion;
            this.SeccionEditar = seccion;
            this.SeccionEditar.archivoSeccionIcono = [];
            this.urlIconoSeccion = this.SeccionEditar.iconoUrl;
        },100)
    }

    onEditarSeccion() {
        this.service.EditarSeccion(this.SeccionEditar, this.loginService.Usuario.id)
            .subscribe(r => {
                this.mostrarPopUpSeccion = !this.mostrarPopUpSeccion;
                this.ObtenerServicios();
                this.SeccionEditar = r.iconoUrl;
                Alertas.ok("¡Correcto!", "Los datos han sido actualizados")
            }, error => {
                Alertas.error("Ocurrió un error actualizar los datos de la Sección");
            });
    }

    EliminarSeccion(seccion, listadSecciones) {
        Alertas.question("Eliminar Sección", "¿Está seguro de querer eliminar esta Sección?")
            .then(r => {
                var indexSeccion = listadSecciones.indexOf(seccion);
                this.service.DesactivarSeccion(seccion.id, this.loginService.Usuario.id)
                    .subscribe(r => {
                        listadSecciones.splice(indexSeccion, 1);
                        Notificaciones.error("La sección ha sido eliminada.");
                    }, error => {
                        Alertas.error("Ocurrió un error al intentar eliminar la Sección");
                    });
            });
    }


    EditarColumna(columna) {
        this.columnaAcargar = columna;
        this.mostrarPopUpColumna = !this.mostrarPopUpColumna;
        this.ColumnaEditar = columna;
        this.ColumnaEditar.archivoContenido = [];
        this.ColumnaEditar.contenidoLista = [];
        this.urlContenido = columna.contenido;
        setTimeout(() => {
            this.lueTipoContenido.value = columna.contenidoTipoId;
        },100)
        if (columna.contenidoTipoId == 3) {
            this.itemsListaOrdenar = [];
            this.ColumnaEditar.contenidoLista = this.ColumnaEditar.contenido.split('^');
            this.ColumnaEditar.contenidoLista.forEach(item => {
                var itemLista = {
                    orden: 0,
                    valor: ''
                };
                itemLista.orden = this.itemsListaOrdenar.length +1;
                itemLista.valor = item;
                this.itemsListaOrdenar.push(itemLista);
            })
            this.listado = this.ColumnaEditar.contenido;
        }
    }

    onPopUpColumnaContentReady(){
        
        this.lueTipoContenido.value = this.columnaAcargar.contenidoTipoId;
    }


    onEditarColumna() {
        if (this.editandoContenido) {
            Notificaciones.error("Guarde los elementos de la lista");
            return;
        }
        if (this.nuevaColumna){
            if (this.tipoContenido.id == 3) {
                this.ColumnaEditar.contenido = this.listado;
                this.listado = '';
            }
            this.ColumnaEditar.contenidoTipo = this.tipoContenido.id;
            this.SeccionEditar.columnas.push(this.ColumnaEditar);
            Alertas.load("Espere un momento por favor", "");
            this.service.NuevaColumna(this.SeccionEditar, this.loginService.Usuario.id)
            .subscribe(r => {
                Alertas.ok("¡Correcto!", "La columna ha sido creada" )
                this.ColumnaEditar = new Columna();
                this.SeccionEditar = new Seccion();
                this.ObtenerServicios();
                this.mostrarPopUpColumna = false;
            }, error => {
                Alertas.error("Ocurrió un error al intentar agregar la Columna");
                this.nuevaColumna = true;
            });
            this.nuevaColumna = false;
            return;    
        }

        if (this.tipoContenido.id == 3) {
            this.listado = '';
            this.ColumnaEditar.contenidoLista.forEach(elemento => {
                var index = this.ColumnaEditar.contenidoLista.indexOf(elemento);
                if (index == 0){
                    this.listado += elemento;
                }else{
                    this.listado += "^" + elemento;
                }
            });
            this.ColumnaEditar.contenido = this.listado;
            this.listado = '';
        }
        this.ColumnaEditar.contenidoTipo = this.tipoContenido.id;
        this.service.EditarColumna(this.ColumnaEditar, this.loginService.Usuario.id)
            .subscribe(r => {
                this.mostrarPopUpColumna = !this.mostrarPopUpColumna;
                this.ObtenerServicios();
                Alertas.ok("¡Correcto!", "Los datos han sido actualizados");
            }, error => {
                Alertas.error("Ocurrió un error actualizar los datos de la Columna");
            });
    }

    EliminarColumna(columna, listadoColumnas) {
        Alertas.question("Eliminar Columna", "¿Está seguro de querer eliminar esta Columna?")
            .then(r => {
                var indexColumna = listadoColumnas.indexOf(columna);
                this.service.DesactivarColumna(columna.id, this.loginService.Usuario.id)
                    .subscribe(r => {
                        listadoColumnas.splice(indexColumna, 1);
                        Notificaciones.error("La columna ha sido eliminada.");
                    }, error => {
                        Alertas.error("Ocurrió un error al intentar eliminar la Columna");
                    });
            });
    }

    onNuevaColumna(seccion) {
        this.SeccionEditar = new Seccion();
        this.SeccionEditar.id = seccion.id;
        this.mostrarPopUpColumna = !this.mostrarPopUpColumna;
        this.ColumnaEditar = new Columna();
        this.nuevaColumna = true;
    }

    onNuevaSeccion(servicio) {
        this.router.navigate(['ecommerce/servicios/agregarseccion/', servicio.servicioId]);
    }

    onTipoSeccionChanged(tipo) {
        this.ColumnaEditar.contenidoTipoId = tipo;
        this.mostrarImagenSeccion = false;
        this.mostrarTextoSeccion = false;
        this.mostrarVideoEnlaceSeccion = false;
        this.mostrarListaSeccion = false;
        if (tipo === 1) {
            this.mostrarTextoSeccion = true;
        } else if (tipo === 2) {
            this.mostrarImagenSeccion = true;
        } else if (tipo === 4) {
            this.mostrarVideoEnlaceSeccion = true;
        } else if (tipo === 3) {
            this.mostrarListaSeccion = true;
        }
    }
    //
    onAgregarTextoALista() {
        if (this.txtTextoListado.value === '') { return; }
        //this.listadoContenido
        this.ColumnaEditar.contenidoLista.push(this.txtTextoListado.value);
        if (this.listado == '') {
            this.listado += this.txtTextoListado.value;
        } else {
            this.listado += '^' + this.txtTextoListado.value;
        }
        this.txtTextoListado.value = '';
    }

    onEliminarElementoLista(item) {
        var index = this.ColumnaEditar.contenidoLista.indexOf(item);
        this.ColumnaEditar.contenidoLista.splice(index, 1);
    }

    onEditarElementoLista(item) {
        if (this.editandoContenido && item !== this.contenido){
            return;
        }

        this.editandoContenido = !this.editandoContenido;
        this.contenido = item;
        var index = this.ColumnaEditar.contenidoLista.indexOf(item);
        if (this.editandoContenido) {
            this.txtEditarElementoLista = item;
        } else {
            this.ColumnaEditar.contenidoLista[index] = this.txtEditarElementoLista;
            this.itemsListaOrdenar[index].valor = this.txtEditarElementoLista;
        }
    }

    onSeleccionarIconoSeccion_DxFile(event: any) {
        if (event.value[0] && event.element.id === 'fupIconoSeccion') {
            const reader = new FileReader();
            reader.onload = (event: any) => {
                this.urlIconoSeccion = event.target.result;
            };
            reader.readAsDataURL(event.value[0]);
        }
    }
    onSeleccionarIconoMovil_DxFile(event: any) {
        if (event.value[0] && event.element.id === 'fuIconoApp') {
            const reader = new FileReader();
            reader.onload = (event: any) => {
                this.urlIconoMovil = event.target.result;
            };
            reader.readAsDataURL(event.value[0]);
        }
    }

    onSeleccionarIconoWeb_DxFile(event: any) {
        if (event.value[0] && event.element.id === 'fuIconoWeb') {
            const reader = new FileReader();
            reader.onload = (event: any) => {
                this.urlIconoWeb = event.target.result;
            };
            reader.readAsDataURL(event.value[0]);
        }
    }

    onSeleccionarArchivoColumna_DxFile(event: any) {
        if (event.value[0] && event.element.id === 'fuArchivoColumna') {
            const reader = new FileReader();
            reader.onload = (event: any) => {
                this.urlContenido = event.target.result;
            };
            reader.readAsDataURL(event.value[0]);
        }
    }
    onOrdenarElementosLista(){
        this.mostrarPopUpOrdenarLista = !this.mostrarPopUpOrdenarLista;
    }

    cambiarOrdenItemLista(item, sube: boolean){
        this.service.cambiarOrdenItem(this.itemsListaOrdenar, item, sube)
    }

    OrdenarElementosLista(){
        this.listado = '';
        this.ColumnaEditar.contenidoLista = [];
        this.itemsListaOrdenar.forEach(item => {
            if (this.listado == '') {
                this.listado += item.valor;
            } else {
                this.listado += '^' + item.valor;
            }
            this.ColumnaEditar.contenidoLista.push(item.valor);
        });
        this.onOrdenarElementosLista();
    }
    
    onOrdenarElementosSecciones(listadoSecciones) {
        this.listadoSeccionesOrdenar = listadoSecciones;
        setTimeout(() => {
            this.mostrarPopUpOrdenarListaSecciones = !this.mostrarPopUpOrdenarListaSecciones;
        },200)
    }

    cambiarOrdenItem(item, sube: boolean){
        this.service.cambiarOrdenItem(this.listadoSeccionesOrdenar, item, sube);
    }

    OrdenarElementosSecciones(){
        Alertas.question("Actualizar orden de Secciones", "¿Está seguro de querer actualizar el orden?")
            .then(r => {
                this.service.ActualizarOrdenDeSecciones(this.listadoSeccionesOrdenar, this.loginService.Usuario.id)
                .subscribe(r => {
                    this.mostrarPopUpOrdenarListaSecciones = !this.mostrarPopUpOrdenarListaSecciones;
                    Notificaciones.success("El orden de las Secciones se ha actualizado");
                }, error => {
                    Alertas.error("Ocurrió un error al intentar actualizar el orden de las secciones");
                });
            })
    }

    actualizarEstadoVisibleEnPaginaWeb(servicioId, paginaWebVisible, servicio){
        this.service.ActualizarEstadoVisibleEnPaginaWeb(servicioId, !paginaWebVisible, this.loginService.Usuario.id)
        .subscribe(r => {
            servicio.paginaWebVisible = !paginaWebVisible;
            Alertas.ok(`¡Servicio ${(servicio.paginaWebVisible) ? 'Habilitado' : 'Deshabilitado'}!`);
        })
    }

    colorearFila = function (e) {
        if (e.rowType == "data"){
            let rowElement = e.rowElement;
            if (e.data.paginaWebVisible == true)
                rowElement.style.background = '#7cd88157';
            if (e.data.deshabilitadoPorFechaDeFinalizacion == true)
                rowElement.style.background = '#ffcccc';
        }
    }
}