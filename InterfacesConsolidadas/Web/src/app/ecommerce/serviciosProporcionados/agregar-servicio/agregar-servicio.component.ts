import { Component, OnInit, OnChanges, AfterViewInit, ViewChild } from "@angular/core";
import { LoginService } from "../../../login/services/login.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Servicio } from "../models/Servicio";
import { AddSeccion } from "../models/AddSeccion";
import { ContenidoTipo } from "../models/ContenidoTipo";
import { ServiciosProporcionadosService } from "../services/ServiciosProporcionados.service";
import { isUndefined } from "util";
import { Pagina } from "../models/Pagina";
import { Banner } from "../models/BannerDeServicio";
import { helpers } from "../../../helpers/utils";
import { Forms } from "../../../helpers/forms";
import { Alertas, Notificaciones } from "../../../helpers/notificaciones/notificaciones";
import { addServicio } from "../models/addServicio";
import { AddColumna } from "../models/AddColumna";
import { DxTextBoxComponent, DxSelectBoxComponent } from "devextreme-angular";
import { ServicioDetalle } from "../models/ServicioDetalle";
declare var $: any;

@Component({
    selector: 'app-agregar-servicio',
    templateUrl: './agregar-servicio.component.html',
    styleUrls: ['./agregar-servicio.component.css'],
    providers: [LoginService, ServiciosProporcionadosService]
})

export class AgregarServicioComponent implements OnInit, OnChanges, AfterViewInit {
    constructor(private servicioService: ServiciosProporcionadosService,
        private loginService: LoginService,
        private route: ActivatedRoute,
        private router: Router) {
        this.servicio = new Servicio();
        this.nuevoServicio = new addServicio();
        this.seccion = new AddSeccion();
        this.tipoContenido = new ContenidoTipo();
        this.columna = new AddColumna();
        this.detalleTitulo = new ServicioDetalle();
        this.detalleSubtitulo1 = new ServicioDetalle();
        this.detalleSubtitulo2 = new ServicioDetalle();
        this.columnaEditando = new AddColumna();
        this.urlBanner = 'https://via.placeholder.com/1500x500';
        this.urlBannerMovil = 'https://via.placeholder.com/365x200';
        this.urlIconoMovil = 'https://via.placeholder.com/72x72';
        this.urlIconoWeb = 'https://via.placeholder.com/72x72';
        this.urlContenido = '';
        this.urlIconoSeccion = 'https://via.placeholder.com/150x150';
        this.configurarModoFormulario();
        this.obtenerSeccionesTipos();        
        this.contenidoLista = [];
    }

    ngOnInit() {
        var self = this;
        self.detalleSubtitulo1.color = '#000000';
        self.detalleSubtitulo2.color = '#000000';
        // Code for the Validator
        var SelectedFiles = []

        var $validator = $('.wizard-card form').validate({
            rules: {
                txtNombre: {
                    required: true,
                    minlength: 3,
                },
                txtSubtitulo: {
                    required: false,
                },
                txaDescripcion: {
                    required: true,
                    minlength: 3,
                },
                txtTituloSeccion: {
                    required: true,
                    minlength: 3,
                },
                txaContenido: {
                    required: true,
                    minlength: 3,
                }
            },

            errorPlacement: function (error, element) {
                $(element).parent('div').addClass('has-error');
            }
        });
        // Wizard Initialization
        $('.wizard-card').bootstrapWizard({
            'tabClass': 'nav nav-pills',
            'nextSelector': '.btn-next',
            'previousSelector': '.btn-previous',

            onNext: function (tab, navigation, index) {
                var $valid = $('.wizard-card form').valid();
                if (!$valid || !self.esValidoTab) {
                    $validator.focusInvalid();
                    return false;
                }
            },

            onInit: function (tab, navigation, index) {
                //check number of tabs and fill the entire row
                var $total = 5;//navigation.find('li').length;
                var $width = 100 / $total;
                var $wizard = navigation.closest('.wizard-card');

                var $display_width = $(document).width();
                var $sidebar_width = $('.sidebar').width();

                if ($display_width < 600 && $total > 3) {
                    $width = 50;
                }

                navigation.find('li').css('width', $width + '%');
                var $first_li = navigation.find('li:first-child a').html();
                var $moving_div = $('<div class="moving-tab">' + $first_li + '</div>');
                $('.wizard-card .wizard-navigation').append($moving_div);

                //    this.refreshAnimation($wizard, index);
                var total_steps = 5;//$wizard.find('li').length;
                var move_distance = $wizard.width() / total_steps;
                var step_width = move_distance;
                move_distance *= index;

                var $current = index + 1;

                if ($current == 1) {
                    move_distance -= 8;
                } else if ($current == total_steps) {
                    move_distance += 8;
                }

                $wizard.find('.moving-tab').css('width', step_width);
                $('.moving-tab').css({
                    'transform': 'translate3d(' + move_distance + 'px, 0, 0)',
                    'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

                });

                $('.moving-tab').css('transition', 'transform 0s');
            },

            onTabClick: function (tab, navigation, index) {

                var $valid = $('.wizard-card form').valid();
                var $current = index + 1;
                
                if (!$valid ) {
                    return false;
                } else {
                    return true;
                }
            },

            onTabShow: function (tab, navigation, index) {
                var $total = 5;//navigation.find('li').length;
                var $current = index + 1;

                var $wizard = navigation.closest('.wizard-card');

                // If it's the last tab then hide the last button and show the finish instead
                if ($current >= $total) {
                    $($wizard).find('.btn-next').hide();
                    $($wizard).find('.btn-finish').show();
                } else {
                    $($wizard).find('.btn-next').show();
                    $($wizard).find('.btn-finish').hide();
                }

                var button_text = navigation.find('li:nth-child(' + $current + ') a').html();

                setTimeout(function () {
                    $('.moving-tab').text(button_text);
                }, 150);

                var checkbox = $('.footer-checkbox');

                if (index !== 0) {
                    $(checkbox).css({
                        'opacity': '0',
                        'visibility': 'hidden',
                        'position': 'absolute'
                    });
                } else {
                    $(checkbox).css({
                        'opacity': '1',
                        'visibility': 'visible'
                    });
                }

                // this.refreshAnimation($wizard, index);
                var total_steps = 5;//$wizard.find('li').length;
                var move_distance = $wizard.width() / total_steps;
                var step_width = move_distance;
                move_distance *= index;

                var $current = index + 1;

                if ($current == 1) {
                    move_distance -= 8;
                } else if ($current == total_steps) {
                    move_distance += 8;
                }

                $wizard.find('.moving-tab').css('width', step_width);
                $('.moving-tab').css({
                    'transform': 'translate3d(' + move_distance + 'px, 0, 0)',
                    'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'
                });
            }
        });

        $("#wizard-picture").change(function () {
            this.readURL(this);
        });

        $('[data-toggle="wizard-radio"]').click(function () {
            console.log('click');

            var wizard = $(this).closest('.wizard-card');
            wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
            $(this).addClass('active');
            $(wizard).find('[type="radio"]').removeAttr('checked');
            $(this).find('[type="radio"]').attr('checked', 'true');
        });

        $('.set-full-height').css('height', 'auto');
    }
    ngOnChanges() {
        var input = $(this);
        var target: EventTarget;
        if (input.files && input.files[0]) {
            var reader: any = new FileReader();

            reader.onload = function (e) {
                $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    ngAfterViewInit() {
        $('.wizard-card').each(function () {

            var $wizard = $(this);
            var index = undefined;

            var total_steps = 4;//$wizard.find('li').length;
            var move_distance = $wizard.width() / total_steps;
            var step_width = move_distance;
            move_distance *= index;

            var $current = index + 1;

            if ($current == 1) {
                move_distance -= 8;
            } else if ($current == total_steps) {
                move_distance += 8;
            }

            $wizard.find('.moving-tab').css('width', step_width);
            $('.moving-tab').css({
                'transform': 'translate3d(' + move_distance + 'px, 0, 0)',
                'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'
            });

            $('.moving-tab').css({
                'width': step_width + '%!important',
                'transition': 'transform 0s'
            });
        });

    }

    @ViewChild('txtTextoListado')
    txtTextoListado: DxTextBoxComponent;

    // @ViewChild('txtEditar')
    // txtEditar: DxTextBoxComponent;

    @ViewChild('lueTipoContenido')
    lueTipoContenido: DxSelectBoxComponent;

    // Control
    urlIconoWeb: string;
    siTieneIconoWeb = false;
    urlIconoMovil: string;
    siTieneIconoMovil = false;
    urlBanner: string;
    urlContenido: string;
    siTieneIconoContenido = false;
    urlBannerMovil: string;
    urlIconoSeccion: string;
    siTieneIconoSeccion = false;
    modoEdicion = false;
    modo: Forms.Modo = Forms.Modo.Agregar;
    servicioIdEditando: number = 0;
    fileUploader: any;
    seccionSeleccionada: any;
    mostrarBotonAgregarColumna = false;
    agregarSeccion = false;
    editandoContenido: boolean = false;
    contenido: string = '';
    servicioCreado = false;
    nuevoColor: any;
    minDate: Date = new Date(Date.now());
    rutaActual = '';
    esValidoTab = false;
    mostrarPopUpOrdenarLista = false;
    contenidoLista: any;
    
    //--PopUp de Seccion 
    popupAgregarSeccion: boolean = false;
    mostrarImagenSeccion: boolean = false;
    mostrarTextoSeccion: boolean = false;
    mostrarListaSeccion: boolean = false;
    mostrarVideoEnlaceSeccion: boolean = false;
    txtEditarElementoLista: string = '';

    // Modelos
    servicio: Servicio;
    nuevoServicio: addServicio;
    seccion: AddSeccion;
    columna: AddColumna;
    tipoContenido: ContenidoTipo;
    bannersDeServicio: Banner[] = [];
    detalleTitulo: ServicioDetalle;
    detalleSubtitulo1: ServicioDetalle;
    detalleSubtitulo2: ServicioDetalle;
    columnaEditando: AddColumna;

    // Listas
    nuevasSecciones: AddSeccion[] = [];
    tiposSecciones: ContenidoTipo[] = [];
    listaPaginas: Pagina[] = [];
    listaColumnas: AddColumna[] = [];
    listado: string = '';
    listaDetalles: ServicioDetalle[] = [];
    //listadoContenido = [];

    // Funciones
    configurarModoFormulario() {        
        this.route.url.subscribe(rutas => {            
            var ruta = rutas.find(x => x.path === 'agregar');
            if (!helpers.isNull(ruta)) {
                window.loader.hide();
                this.modoEdicion = false;
                return;
            }
            ruta = rutas.find(x => x.path === 'editar');
            var tabAmostrar = 2;
            if (!helpers.isNull(ruta)) {
                tabAmostrar = 1;
            }
            
            this.modo = Forms.Modo.Actualizar;
            this.route.params.subscribe(params => {
                const id = params.servicioId as number;
                this.servicioIdEditando = id;
                this.modoEdicion = true;
                this.obtenerServicioPorId(id, tabAmostrar);
            });
        });
    }
    
    obtenerServicioPorId(servicioId: number, tabAmostrar: number) {
        Alertas.load("Espere un momento por favor");
        this.servicioService.ObtenerServicioPorId(servicioId)
            .subscribe(r => {
                this.servicio = r;
                this.servicio.archivoIconoApp = [];
                this.servicio.archivoIconoWeb = [];
                this.servicio.servicioId = servicioId;
                this.urlIconoMovil = r.iconoMovilUrl;
                this.urlIconoWeb = r.iconoWebUrl;
                if (this.servicio.detalles.length > 0){
                    this.detalleTitulo = this.servicio.detalles.find(d=>d.nivelTexto == 1);
                    this.detalleSubtitulo1 = this.servicio.detalles.find(d=>d.nivelTexto == 2);
                    this.detalleSubtitulo2 = this.servicio.detalles.find(d=>d.nivelTexto == 3);
                    if (this.detalleSubtitulo1.enlace != ""){
                        this.detalleSubtitulo1.agregarEnlace = true;
                    }else{
                        this.detalleSubtitulo1.agregarEnlace = false;
                    }
                    if (this.detalleSubtitulo2.enlace != ""){
                        this.detalleSubtitulo2.agregarEnlace = true;
                    }else{
                        this.detalleSubtitulo2.agregarEnlace = false;
                    }
                }
                this.establecerMinDate();
                $('#wizardServicios').bootstrapWizard('show', tabAmostrar);
                Alertas.close();
            });
    }

    establecerMinDate(){
        let fecha1 = new Date(Date.now());
        let fecha2 = new Date(this.servicio.fechaInicio)
        let same = fecha1 === fecha2;
        if (!same){
            if (fecha1 > fecha2){
                this.minDate = fecha2;
            }else{
                this.minDate = fecha1;
            }
        }
    }
    obtenerSeccionesTipos() {
        this.servicioService.ObtenerSeccionesTipos().subscribe(r => {
            this.tiposSecciones = r;
        });
    }

    obtenerPaginas() {
        this.servicioService.ObtenerPaginas().subscribe(r => {
            this.listaPaginas = r;
        })
    }

    guardarServicio() {
        Alertas.load("Espere un momento por favor");
        if (this.modo === Forms.Modo.Agregar) {
            if (this.nuevoServicio.archivoBannerWeb.length <=0){
                Alertas.close();
                Alertas.error('¡ERROR!', 'Debes seleccionar el banner para esta Landing Page');
                return;
            }
            if (this.nuevoServicio.archivoBannerMovil.length <=0){
                Alertas.close();
                Alertas.error('¡ERROR!', 'Debes seleccionar el banner para esta Landing Page');
                return;
            }

            this.nuevoServicio.descripcion = this.servicio.descripcion;
            this.nuevoServicio.subtitulo2 = this.servicio.subtitulo2;
            this.nuevoServicio.subtitulo1 = this.servicio.subtitulo1;
            this.nuevoServicio.tieneFechaDeFinalizacion = this.servicio.tieneFechaDeFinalizacion;
            this.nuevoServicio.fechaInicio = this.servicio.fechaInicio;
            this.nuevoServicio.fechaFinalizacion = this.servicio.fechaFinalizacion;
            this.nuevoServicio.secciones = this.nuevasSecciones;
            this.nuevoServicio.detalles = this.listaDetalles;
            this.nuevoServicio.paginaWebLink = this.servicio.paginaWebLink;
            this.servicioService.SubirImagenes(this.nuevoServicio, this.loginService.Usuario.id)
                .subscribe(r => {
                    Alertas.close();
                    this.servicioCreado = true;
                    Alertas.ok('¡Correcto!', 'Los datos han sido guardados correctamente.' );
                    this.limpiarFormulario();
                    this.router.navigate(["ecommerce/servicios/listadoServicios"]);
                }, error => {
                    Alertas.close();
                    Alertas.error('¡ERROR!', error._body);
                });
        }
        else {
            this.route.url.subscribe(rutas => {
                var ruta = rutas.find(x => x.path === 'editar');
                if(helpers.isNull(ruta)) {
                    this.seccion.servicioId = this.servicio.servicioId;
                    this.seccion.usuarioAgrega = this.loginService.Usuario.id;
                    this.nuevasSecciones.push(this.seccion);
                    this.servicio.secciones = this.nuevasSecciones;
                    this.servicioService.AgregarSeccion(this.servicio, this.loginService.Usuario.id)
                        .subscribe(r => {
                            Alertas.close();
                            this.servicioCreado = true;
                            Alertas.ok('¡Correcto!',  'Los datos han sido guardados correctamente.');
                            this.limpiarFormulario();
                            this.router.navigate(["ecommerce/servicios/listadoServicios"]);
                        }, error => {
                            Alertas.close();
                            Alertas.error('¡ERROR!', error._body);
                        });
                } else {
                    var listaDetalles = [];
                    listaDetalles.push(this.detalleTitulo);
                    listaDetalles.push(this.detalleSubtitulo1);
                    listaDetalles.push(this.detalleSubtitulo2);
                    this.servicio.archivoIconoApp = this.nuevoServicio.archivoIconoApp;
                    this.servicio.archivoIconoWeb = this.nuevoServicio.archivoIconoWeb;

                    listaDetalles.forEach(element => {
                        if (!element.agregarEnlace){
                            element.enlace = "";
                        }
                    });
                    this.servicio.detalles = listaDetalles;
                    debugger;
                    this.servicioService.EditarServicio(this.servicio, this.loginService.Usuario.id)
                        .subscribe(r => {
                            Alertas.ok("¡Correcto!", "Los datos han sido actualizados" );
                            this.router.navigate(["ecommerce/servicios/listadoServicios"]);
                        }, error => {
                            if (error._body != null){
                                Alertas.error("Ocurrió un error", error._body);
                                return;
                            }
                            Alertas.error("Ocurrió un error actualizar los datos del Servicio");
                        });
                }
            })
        }
    }
    //****** Pasos Wizard ******
    onSiguiente(index): boolean {
        var resultado = true;
        switch (index) {
            case 1:
                if (this.nuevoServicio.archivoBannerWeb.length === 0){
                    Notificaciones.error('Debe seleccionar el Banner para la versión web');
                    resultado = false;
                    break;
                }
                if (this.nuevoServicio.archivoBannerMovil.length === 0){
                    Notificaciones.error('Debe seleccionar el Banner para la versión móvil');
                    resultado = false;
                    break;
                }
                break;
            case 2:                
                if (this.servicio.descripcion === '') {
                    Notificaciones.error('Debe ingresar un nombre para el Servicio');
                    resultado = false;
                    break;
                }
                if (this.servicio.descripcion === '') {
                    Notificaciones.error('Debe ingresar un nombre para el Servicio');
                    resultado = false;
                    break;
                }
                if (this.nuevoServicio.archivoIconoApp.length === 0) {
                    Notificaciones.error('Debe seleccionar un icono para la App');
                    resultado = false;
                    break;
                }
                if (this.nuevoServicio.archivoIconoWeb.length === 0) {
                    Notificaciones.error('Debe seleccionar un icono para la Web');
                    resultado = false;
                    break;
                }
                this.listaDetalles = [];
                this.detalleTitulo.nivelTexto = 1;
                this.detalleSubtitulo1.nivelTexto = 2;
                this.detalleSubtitulo2.nivelTexto = 3;
                this.listaDetalles.push(this.detalleTitulo);
                this.listaDetalles.push(this.detalleSubtitulo1);
                this.listaDetalles.push(this.detalleSubtitulo2);
                break;
            case 3:
                if (this.seccion.titulo === '') {
                    Notificaciones.error('Debe ingresar un título para la Sección');
                    resultado = false;
                    break;
                }
                if (this.seccion.archivoSeccionIcono.length === 0) {
                    Notificaciones.error('Debe seleccionar un icono para la Sección');
                    resultado = false;
                    break;
                }
                break;
            case 4:
                
                if (this.tipoContenido.id == 2) {
                    this.columna.contenido = this.urlContenido;
                }
                else if (this.tipoContenido.id == 3) {
                    this.columna.contenido = this.listado;
                    this.listado = '';
                }
                if (this.listaColumnas.length == 0){
                    if (this.columna.contenido === '') {
                        Notificaciones.error('La columna debe tener un contenido.');
                        resultado = false;
                        break;
                    }
                }
                if (this.editandoContenido){
                    break;
                }
                this.onAgregarSeccionAlista();
                break;
            default:
                break;
        }
        return resultado;
    }

    onSiguienteButton() {
        var $valid = $('.wizard-card form').valid();
        var currentTab = $('#wizardServicios').bootstrapWizard('currentIndex');
        var nextTab = currentTab + 1;
        var res = this.onSiguiente(nextTab);
        if (currentTab == 1){
            this.agregarSeccion = true;
        }
        if ((!$valid && !this.agregarSeccion) || !res) {
            this.esValidoTab = false;
            return false;
        }
        this.esValidoTab = true;
        $('#wizardServicios').bootstrapWizard('show', nextTab);
    }

    //****** Eventos ******
    // ---------- Servicios ---------- 
    onCancelarServicio() {
        this.limpiarFormulario();
    }
    // ---------- Seccion ---------- 
    // onAgregarUnaSeccion() {
    //     this.popupAgregarSeccion = !this.popupAgregarSeccion;
    // }
    onAgregarSeccionAlista() {
        if (this.seccion.titulo == "") {
            return;
        }
        if (this.modo == Forms.Modo.Actualizar) {
            this.seccion.servicioId = this.servicio.servicioId;
        }
        this.seccion.columnas = this.listaColumnas;
        this.seccion.usuarioAgrega = this.loginService.Usuario.id;
        this.seccion.orden = this.nuevasSecciones.length + 1;
        this.nuevasSecciones.push(this.seccion);
        console.log(this.nuevasSecciones);
        this.listaColumnas = [];
        this.seccion = new AddSeccion;
        //this.mostrarBotonAgregarColumna = false;
    }

    onSeccionSeleccionada(seccion) {
        this.seccionSeleccionada = seccion;
    }
    onTipoSeccionChanged(tipo) {
        this.columna.contenidoTipo = tipo;
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
        this.mostrarBotonAgregarColumna = true;
    }

    onCancelarSeccion() {
        this.seccion.titulo = '';
        this.tipoContenido.id = 0;
        this.urlContenido = ''
    }

    onNuevaSeccion() {
        this.agregarSeccion = true;
        this.seccion = new AddSeccion;
        this.columna = new AddColumna;
        this.columna.contenidoLista = [];
        this.contenidoLista = [];
        this.listaColumnas = [];
        this.lueTipoContenido.value = 0;
        this.mostrarBotonAgregarColumna = false;
        this.urlIconoSeccion = 'https://via.placeholder.com/150x150'
        $('#wizardServicios').bootstrapWizard('show', 2);
    }

    onCancelarNuevaSeccion() {
        this.onNuevaSeccion();
        $('#wizardServicios').bootstrapWizard('show', 4);
    }
    // ---------- Columna ---------- 
    onAgregarColumna(limpiarColumna) {
        if (this.sePuedeAgregarUnaColumna()) {
            this.agregarColumna(limpiarColumna);
            this.mostrarBotonAgregarColumna = true;
        }
        else {
            this.mostrarBotonAgregarColumna = false;
            Notificaciones.error('Una sección sólo puede tener 2 Columnas');
            return false;
        }
    }

    agregarColumna(limpiarColumna) {
        if (this.seccion.titulo == "") {
            Notificaciones.error("Debe estar ingresada una sección para poder agregar esta columna")
            return;
        }
        this.columna.contenidoTipo = this.tipoContenido.id;
        this.columna.usuarioAgrega = this.loginService.Usuario.id;
        if (this.tipoContenido.id == 3) {
            this.columna.contenido = this.listado;
            this.listado = '';
        }
        this.listaColumnas.push(this.columna);
        if (limpiarColumna) {
            this.columna = new AddColumna();
            this.urlContenido = '';
        }
        if (!this.sePuedeAgregarUnaColumna()) {
            this.mostrarBotonAgregarColumna = false;
        }
        Notificaciones.success('¡Columna agregada!');
    }

    sePuedeAgregarUnaColumna(): boolean {
        if (this.listaColumnas.length <= 1) {
            return true;
        }
        return false;
    }

    onEditarColumna(columna) {
        this.editandoContenido = !this.editandoContenido;
        var index = this.columna.contenidoLista.indexOf(columna);
        if (this.editandoContenido) {
            this.columna = columna;
            this.lueTipoContenido.value = this.columna.contenidoTipo;
        } else {
            this.listaColumnas[index] = this.columna;
            this.columna = new AddColumna();
        }
    }

    //*****   Contenido de Columna  ******
    // Imagen
    // Texto
    // Video
    // Lista
    onAgregarTextoALista() {
        if (this.txtTextoListado.value === '') { return; }
        var itemLista = {
            orden: 0,
            valor: ''
        };
        itemLista.valor = this.txtTextoListado.value;
        itemLista.orden = this.contenidoLista.length +1;
        this.contenidoLista.push(itemLista);
        this.columna.contenidoLista.push(this.txtTextoListado.value);
        if (this.listado == '') {
            this.listado += this.txtTextoListado.value;
        } else {
            this.listado += '^' + this.txtTextoListado.value;
        }
        this.txtTextoListado.value = '';
    }

    onEliminarElementoLista(item) {
        var index = this.columna.contenidoLista.indexOf(item);
        this.columna.contenidoLista.splice(index, 1);
        this.contenidoLista.splice(index, 1);
    }

    onEditarElementoLista(item) {
        if (this.editandoContenido && item !== this.contenido){
            return;
        }
        this.editandoContenido = !this.editandoContenido;
        this.contenido = item;
        var index = this.columna.contenidoLista.indexOf(item);
        if (this.editandoContenido) {
            this.txtEditarElementoLista = item;
        } else {
            this.columna.contenidoLista[index] = this.txtEditarElementoLista;
            this.contenidoLista[index].valor = this.txtEditarElementoLista;
        }
    }


    // Enlace

    // GENERALES
    limpiarFormulario() {
        this.servicio.subtitulo2 = '';
        this.servicio.iconoMovilUrl = '';
        this.servicio.iconoWebUrl = '';
        this.servicio.descripcion = '';
        this.servicio.subtitulo1 = '';
        this.urlIconoMovil = 'https://via.placeholder.com/72x72';
        this.urlIconoWeb = 'https://via.placeholder.com/72x72';
        this.fileUploader.reset();
        this.columna = new AddColumna();
        this.seccion = new AddSeccion();
        this.urlIconoSeccion = 'https://via.placeholder.com/150x150';
        this.urlContenido = '';
        this.listaDetalles = [];
        this.nuevasSecciones = [];
    }

    InicializarDXFileIconoApp(event) {
        this.fileUploader = event.component;
    }

    onPaginaSeleccionada(paginaId) {
        this.servicioService.ObtenerUrlBannerPorPaginaSeleccionada(paginaId).subscribe(r => {
            this.bannersDeServicio = r;
            this.setUrlDeBanners();
        });
    }

    onSeleccionar_DxFile(event: any) {
        if (event.value[0]) {
            var id = event.element.id;
            const reader = new FileReader();
            reader.onload = (event: any) => {
                switch (id) {
                    case 'fuIconoApp':
                        this.urlIconoMovil = event.target.result;
                        this.siTieneIconoMovil = true;
                        break;
                    case 'fuIconoWeb':
                        this.urlIconoWeb = event.target.result;
                        this.siTieneIconoWeb = true;
                        break;
                    case 'fupIconoSeccion':
                        this.urlIconoSeccion = event.target.result;
                        this.siTieneIconoSeccion = true;
                        break;
                    case 'fuArchivoColumna':
                        this.urlContenido = event.target.result;
                        this.siTieneIconoContenido = true;
                        break;
                    case 'fupBannerWeb':
                        this.urlBanner = event.target.result;
                        break;
                    case 'fupBannerMovil':
                        this.urlBannerMovil = event.target.result;
                        break;
                    default:
                        break;
                }
            };
            reader.readAsDataURL(event.value[0]);
        }
    }

    // Secundarias
    setUrlDeBanners() {
        var bannerWeb = this.bannersDeServicio.find(b => b.esVersionMovil === false);
        var bannerMovil = this.bannersDeServicio.find(b => b.esVersionMovil === true);
        if (!isUndefined(bannerWeb)) {
            this.urlBanner = bannerWeb.bannerUrl;
        } else {
            this.urlBanner = 'https://via.placeholder.com/1500x345';
        }
        if (!isUndefined(bannerMovil)) {
            this.urlBannerMovil = bannerMovil.bannerUrl;
        } else {
            this.urlBannerMovil = 'https://via.placeholder.com/365x200';
        }
    }

    onOrdenarElementosLista() {
        this.mostrarPopUpOrdenarLista = !this.mostrarPopUpOrdenarLista;
    }

    OrdenarElementosLista(){
        this.listado = '';
        this.columna.contenidoLista = [];
        this.contenidoLista.forEach(item => {
            if (this.listado == '') {
                this.listado += item.valor;
            } else {
                this.listado += '^' + item.valor;
            }
            this.columna.contenidoLista.push(item.valor);
        });
        this.onOrdenarElementosLista();
    }

    cambiarOrdenItem(item, sube: boolean){
        this.servicioService.cambiarOrdenItem(this.contenidoLista,item, sube);
    }
}