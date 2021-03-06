import { Component, OnInit, Renderer, ViewChild, ElementRef, Directive } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {SubirBannersService} from '../../ecommerce/Banners/Subir-Banners/services/subir.banners.service';
import { Empresa } from '../../ecommerce/Banners/Subir-Banners/models/Empresa';
import { DxLookupComponent } from 'devextreme-angular';
import { Pais } from '../../ecommerce/Banners/Subir-Banners/models/Pais';
import { isUndefined } from 'util';
import { VariablesGlobales } from '../../helpers/VariablesGlobales';

var misc: any = {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
}
declare var $: any;
@Component({
    moduleId: module.id,
    selector: 'navbar-cmp',
    templateUrl: 'navbar.component.html',
    styleUrls: ['./navbar.css'],
    providers: [SubirBannersService]
})

export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    private nativeElement: Node;
    private toggleButton;
    private sidebarVisible: boolean;

    @ViewChild("navbar-cmp") button;

    constructor(location: Location, private renderer: Renderer, private element: ElementRef, private service: SubirBannersService, private router: Router) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
        this.empresaSeleccionada = new Empresa();
    }

    //Variables
    popupSeleccionarEmpresaVisible = false;
    NombreEmpresa = VariablesGlobales.NombreEmpresa;
    RutaImagenPais = VariablesGlobales.RutaImagenPais;

    // modelos
    empresas: Array<any>;

    @ViewChild('lueEmpresa')
    private lueEmpresa: DxLookupComponent;

    //Seleccionados
    empresaSeleccionada: any;
    empresaSeleccionadaId: number;

    ngOnInit() {
        this.listTitles = []//ROUTES.filter(listTitle => listTitle);

        var navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        if ($('body').hasClass('sidebar-mini')) {
            misc.sidebar_mini_active = true;
        }
        $('#minimizeSidebar').click(function () {

            var $btn = $(this);

            if (misc.sidebar_mini_active == true) {
                $('body').removeClass('sidebar-mini');
                misc.sidebar_mini_active = false;

            } else {
                setTimeout(function () {
                    $('body').addClass('sidebar-mini');

                    misc.sidebar_mini_active = true;
                }, 300);
            }

            // we simulate the window Resize so the charts will get updated in realtime.
            var simulateWindowResize = setInterval(function () {
                window.dispatchEvent(new Event('resize'));
            }, 180);

            // we stop the simulation of Window Resize after the animations are completed
            setTimeout(function () {
                clearInterval(simulateWindowResize);
            }, 1000);
        });
        this.ObtenerEmpresas();
    }
    isMobileMenu() {
        if ($(window).width() < 991) {
            return false;
        }
        return true;
    }
    sidebarToggle() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];

        if (this.sidebarVisible == false) {
            setTimeout(function () {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }
    getTitle() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        if (titlee.charAt(0) === '#') {
            titlee = titlee.slice(2);
        }
        for (var item = 0; item < this.listTitles.length; item++) {
            if (this.listTitles[item].path === titlee) {
                return this.listTitles[item].title;
            }
        }
        return 'Dashboard';
    }
    getPath() {
        // console.log(this.location);
        return this.location.prepareExternalUrl(this.location.path());
    }

    ObtenerEmpresas() {
        this.service.ObtenerEmpresas().subscribe(empresas => {
          this.empresas = empresas.map(empresa => ({
            empresaId : empresa.empresaId,
            descripcion : empresa.descripcion,
            paisId: empresa.paisId,
            codigo: empresa.codigo
          }));
        });
    }

    MostrarPopPupEmpresa() {
        this.popupSeleccionarEmpresaVisible = true;
    }

    OcultarPopPupEmpresa() {
        this.popupSeleccionarEmpresaVisible = false;
    }

    ActualizarDatosEmpresa()
    {
        this.NombreEmpresa = VariablesGlobales.NombreEmpresa;
        this.RutaImagenPais = VariablesGlobales.RutaImagenPais;
    }

    ObtenerRutaImagenPais (CodigoPais: string)
    {
        return `assets/img/flags/${CodigoPais}.png`;
    }

    GuardarEmpresaSeleccionada() {
        this.empresaSeleccionada = this.empresas.find(x=> x.empresaId == this.empresaSeleccionadaId);
        localStorage.setItem("CodigoEmpresa", this.empresaSeleccionada.empresaId);
        localStorage.setItem("CodigoPais", this.empresaSeleccionada.codigo);
        localStorage.setItem("PaisId", this.empresaSeleccionada.paisId);
        localStorage.setItem("NombreEmpresa", this.empresaSeleccionada.descripcion);
        localStorage.setItem("RutaImagenPais", this.ObtenerRutaImagenPais(this.empresaSeleccionada.codigo));
        this.ActualizarDatosEmpresa();
        this.OcultarPopPupEmpresa();
        this.router.navigate(['/home']);
    }

}
