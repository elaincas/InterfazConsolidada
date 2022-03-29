import { OnInit, OnChanges, AfterViewInit, ViewChild } from "@angular/core";
import { Component } from '@angular/core';

import { LoginService } from "../../../../login/services/login.service";
import { Planimetria } from "../../Clases/Planimetria";
import { IngresarPlanimetriaService } from "./ingresar-planimetria.service";
import { DxDataGridComponent, DxFileUploaderComponent } from "devextreme-angular";
import { Archivos, ArchivoExcelEImagenes } from "../../Clases/Archivos";
import { TiposArchivos } from "../../Clases/EnumArchivo";
import { Alertas } from "../../../Inventario-Productos/helpers/notificaciones/notificacion";
import { Sucursales } from "../../Clases/Sucursales";
declare var $: any;


@Component({
  selector: 'app-ingreso-planimetria',
  templateUrl: './ingresar-planimetria.component.html',
  styleUrls: ['./ingresar-planimetria.component.css']
})
export class IngresarPlanimetria implements OnInit, OnChanges, AfterViewInit {

  sucursales: any[]
  tiposPlanimetrias: any[]
  planimetria: Planimetria
  slideshowDelay = 2000;
  SelectedFiles = [];
  urlImage = [];
  archivos: ArchivoExcelEImagenes[]
  usuarioID: number;
  _mensajeArchivo: string;
  _mostrarPopup: boolean = false;
  tipoPlanimetriaDescripcion: string = "";
  _mostrarPopupTipoPlanimetria: boolean = false;
  constructor(private loginService: LoginService, private planimetriaService: IngresarPlanimetriaService) {
    this.sucursales = new Array<any>();
    this.tiposPlanimetrias = new Array<any>();
    this.planimetria = new Planimetria();
    this.archivos = new Array<ArchivoExcelEImagenes>()
    this.ObtenerTiposPlanimetrias();
    this.ObtenerSucursales();
    this.usuarioID = this.loginService.Usuario.id;

  }

  ObtenerSucursales() {
    this.planimetriaService.ObtenerSucursales().subscribe(data => {
      this.sucursales = data as any[];
    })
  }
  ObtenerTiposPlanimetrias() {
    this.planimetriaService.ObtenerTipoPlanimetrias().subscribe(data => {
      this.tiposPlanimetrias = data as any[]
    })
  }
  subirArvhivoImagen(data) {
    let archivoImagen;
  
    if (data.value[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.urlImage.push(event.target.result);
        archivoImagen = new ArchivoExcelEImagenes(new Archivos(0, '',TiposArchivos.Imagen, data.value[0].name, data.value, this.usuarioID), null);
        this.archivos.push(archivoImagen);
      };
      reader.readAsDataURL(data.value[0]);
    }
  }
  subirArvhivoExcel(dataEvento, dataFila) {
    let archivoExcel;
    if (dataEvento.value[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        archivoExcel = new ArchivoExcelEImagenes(null, new Archivos(0, '', TiposArchivos.Excel, dataEvento.value[0].name, dataEvento.value, this.usuarioID));
        dataFila.ArchivoExcel = archivoExcel.ArchivoExcel;
      };
      reader.readAsDataURL(dataEvento.value[0]);
    }
  }
  EliminarFila(data) {
    this.archivos.splice(data.rowIndex, 1);
    this.urlImage.splice(data.rowIndex, 1);
  }
  EliminarArchivoExcel(data) {
    this.archivos[data.rowIndex].ArchivoExcel = null;
  }
  MostrarPopup(seDeseaMostrarPopup) {
    if (seDeseaMostrarPopup == 1) {
      this._mostrarPopup = true;
      return;
    }
    this.planimetria.Archivos = this.archivos;
    this._mostrarPopup = false;
  }
  MostrarPopupTipoPlanimetrias(seDeseaMostrarPopup){
    if (seDeseaMostrarPopup == 1) {
      this._mostrarPopupTipoPlanimetria = true;
      return;
    }
    this._mostrarPopupTipoPlanimetria = false;
  }
  GuardarPlanimetria() {

    if (!this.ValidarDatos())
      return;
    this.planimetria.UsuarioCrea = this.usuarioID;  
    this.planimetriaService.AgregarPlanimetria(this.planimetria).subscribe(data => {
      Alertas.ok(data);
      this.LimpiarControles();
    }, error => {
      Alertas.warning("", error);
    });

  }
  ObtenerSucursalesSeleccionadas(data) {
    data.selectedRowsData.forEach(element => {
      this.planimetria.Sucursales = data.selectedRowsData;
      this.planimetria.Sucursales.forEach(dataSucursal=>{
        dataSucursal.SucursalID = element.Codigo;
        dataSucursal.UsuarioId = this.usuarioID;
      })        
    });
  }
  ValidarDatos(): Boolean {
    if (this.planimetria.Descripcion == null || this.planimetria.Descripcion == "") {
      Alertas.warning("", "Debe ingresar un nombre de la planimetría.");
      return false;
    }
    if (this.planimetria.TipoPlanimetriaID == 0) {
      Alertas.warning("", "Debe ingresar el tipo de planimetría.");
      return false;
    }
    if (this.planimetria.FechaInicial == null || this.planimetria.FechaInicial == undefined) {
      Alertas.warning("", "Debe ingresar la fecha inicial de la Planimetría.");
      return false;
    }
    if (this.planimetria.FechaFinal == null || this.planimetria.FechaFinal == undefined) {
      Alertas.warning("", "Debe ingresar la fecha final de la Planimetría.");
      return false;
    }
    if (this.planimetria.Sucursales.length == 0) {
      Alertas.warning("", "Debe ingresar mínimo una sucursal para guardar la planimetría.");
      return false;
    }
    if (this.planimetria.Archivos.length == 0) {
      Alertas.warning("", "Favor asegurarse de que haya ingresado imágenes para guardar la planimetría.");
      return false;
    }
    return true;
  }
  LimpiarControles() {
    this.planimetria = new Planimetria();
    this.ObtenerSucursales();
    this.archivos = []
    this.urlImage = []
    $('#inicio').trigger('click');

  }
  GuardarTipoPlanimetria(){
    if (this.tipoPlanimetriaDescripcion == ""){
      Alertas.warning("","Nombre de tipo de planimetría inválido!");
      return;
    };

    this.planimetriaService.AgregarNuevoTipoPlanimetria(this.tipoPlanimetriaDescripcion).subscribe(data=>{
      Alertas.warning("","Éxito");
      this.MostrarPopupTipoPlanimetrias (0);
      this.ObtenerTiposPlanimetrias();
    },error=>{
      Alertas.warning("",error._body);
    })
  }
  ngOnInit() {
    // Code for the Validator
    var SelectedFiles = []

    var $validator = $('.wizard-card form').validate({
      rules: {
        descripcion: {
          required: true,
          minlength: 3,
        },
        fechaElaboracion: {
          required: true,
        },
        email: {
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
        if (!$valid) {
          $validator.focusInvalid();
          return false;
        }
      },

      onInit: function (tab, navigation, index) {

        //check number of tabs and fill the entire row
        var $total = navigation.find('li').length;
        var $width = 100 / $total;
        var $wizard = navigation.closest('.wizard-card');

        var $display_width = $(document).width();

        if ($display_width < 600 && $total > 3) {
          $width = 50;
        }

        navigation.find('li').css('width', $width + '%');
        var $first_li = navigation.find('li:first-child a').html();
        var $moving_div = $('<div class="moving-tab">' + $first_li + '</div>');
        $('.wizard-card .wizard-navigation').append($moving_div);

        //    this.refreshAnimation($wizard, index);
        var total_steps = $wizard.find('li').length;
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

        if (!$valid) {
          return false;
        } else {
          return true;
        }
      },

      onTabShow: function (tab, navigation, index) {
        var $total = navigation.find('li').length;
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
        var total_steps = $wizard.find('li').length;
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

      var total_steps = $wizard.find('li').length;
      var move_distance = $wizard.width() / total_steps;
      var step_width = move_distance;
      move_distance *= index;

      var $current = index + 1;

      if ($current == 1) {
        move_distance -= 8;
      } else if ($current == total_steps) {
        move_distance += 8;
      }

      $wizard.find('.moving-tab').css('width', '35%');
      $('.moving-tab').css({
        'transform': 'translate3d(' + move_distance + 'px, 0, 0)',
        'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'
      });

      $('.moving-tab').css({
        'width': '35%!important',
        'transition': 'transform 0s'
      });
    });

  }
}