import { OnInit, OnChanges, AfterViewInit, ViewChild } from "@angular/core";
import { Component } from '@angular/core';

import { LoginService } from "../../../../login/services/login.service";
import { Planimetria } from "../../Clases/Planimetria";
import { Archivos, ArchivoExcelEImagenes } from "../../Clases/Archivos";
import { TiposArchivos } from "../../Clases/EnumArchivo";
import { Alertas } from "../../../Inventario-Productos/helpers/notificaciones/notificacion";
import { VisualizarRetroalimentarPlanimetriaService } from "./retroalimentar_visualizar-planimetria.service";
import { DomSanitizer } from "@angular/platform-browser";
declare var $: any;


@Component({
  selector: 'app-ingreso-planimetria',
  templateUrl: './retroalimentar_visualizar-planimetria.component.html',
  styleUrls: ['./retroalimentar_visualizar-planimetria.component.css']
})
export class IngresarVisualizarPlanimetria implements OnInit, OnChanges, AfterViewInit {

  sucursales: any[]
  tiposPlanimetrias: any[]
  planimetria: Planimetria
  slideshowDelay = 2000;
  SelectedFiles = [];
  urlImage = [];
  archivos: ArchivoExcelEImagenes[]
  usuarioID: number;
  nombreSucursal: string = "";
  nombrePlanimetria: string = "";
  _mostrarPopup: boolean;
  urlImagesRetroalimentacion = []

  constructor(private loginService: LoginService, private retroalimetarService: VisualizarRetroalimentarPlanimetriaService, private sanitizer: DomSanitizer) {
    this.usuarioID = this.loginService.Usuario.id;
    this.planimetria = new Planimetria();
    this.archivos = new Array<ArchivoExcelEImagenes>();
    this.ObtenerSucursales();
    this.ObtenerTiposPlanimetrias();
  }

  ObtenerTiposPlanimetrias() {
    this.retroalimetarService.ObtenerTipoPlanimetrias().subscribe(data => {
      this.tiposPlanimetrias = data;
    })
  }
  ObtenerSucursales() {
    this.retroalimetarService.ObtenerSucursales().subscribe(data => {
      this.sucursales = data;
    })
  }
  AsignarNombrePlanimetria() {
    if (this.tiposPlanimetrias == null)
      return;
    this.tiposPlanimetrias.forEach(data => {
      if (this.planimetria.TipoPlanimetriaID == data.id) {
        this.nombrePlanimetria = data.descripcion;
      }
    })
  }
  MostrarPopup(seDeseaMostrarPopup) {
    if (seDeseaMostrarPopup == 1) {
      this._mostrarPopup = true;
      return;
    }
    // else if (!this.ValidarArchivos()) {
    //   return;
    // }
    this._mostrarPopup = false;
    this.planimetria.Archivos = this.archivos;

  }
  AsignarNombreSucursal() {
    if (this.tiposPlanimetrias == null)
    return;
    this.sucursales.forEach(element => {
      if (this.planimetria.SucursalID == element.sucursalID) {
        this.nombreSucursal = element.descripcion;
      }
    });
  }
  onEditorPreparing(e: any): void {
    if (e.parentType == "dataRow" && e.dataField != "Observaciones") {
        e.editorOptions.readOnly = true;
    }
  }
  EliminarFila(data) {
  this.archivos.splice(data.rowIndex, 1);
  this.urlImagesRetroalimentacion.splice(data.rowIndex, 1);
  }
  Buscar() {
    if (this.planimetria.TipoPlanimetriaID == 0)
    {
      Alertas.warning("","Ingrese el tipo de planimetría")
      return ;
    }
    if (this.planimetria.SucursalID == 0)
    {
      Alertas.warning("","Ingrese la sucursal.")
      return ;
    }

    this.retroalimetarService.ObtenerInformacionImagenes(this.planimetria.TipoPlanimetriaID, this.planimetria.SucursalID).subscribe(data => {
      if (data != undefined) {
        data.archivos.forEach(element => {

          let nombre = element.NombreImagen.split('/');
          let nombreImagen = nombre[2];
          this.retroalimetarService.ObtenerArchivo(nombreImagen).subscribe(dataImagen => {
            let blob = new Array(dataImagen);
            let image: File = new File(blob, "prueba.jpeg", { type: "image/jpeg", lastModified: Date.now() });
            this.ConvertirImagen(image);
          })
        });
      }
    }, error => {
      Alertas.warning("", error);
    })
  }
  DescargarArchivos() {
    this.retroalimetarService.ObtenerInformacionArchivos(this.planimetria.TipoPlanimetriaID, this.planimetria.SucursalID).subscribe(data => {
      data.archivos.forEach(element => {
        let nombre = element.NombreImagen.split('/');
        let nombreImagen = nombre[2];
        this.retroalimetarService.descargarArchivos(nombreImagen).subscribe(dataImagen => {
          console.log('start download:', dataImagen);
          var url = window.URL.createObjectURL(dataImagen.data);
          var a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = dataImagen.filename;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove(); // remove the element
        }, error => {
          Alertas.showHttpResponse(error, "");
          console.log('download error:', JSON.stringify(error));
        }, () => {
          console.log('Completed file download.')
        })
    });
  });
  }
  subirArchivoImagen(data) {
    let archivoImagen:ArchivoExcelEImagenes ;
    if (data.value[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.urlImagesRetroalimentacion.push(event.target.result);
        archivoImagen = new ArchivoExcelEImagenes(new Archivos(0,'', TiposArchivos.Imagen, data.value[0].name, data.value, this.usuarioID),null,this.usuarioID);
        this.archivos.push(archivoImagen);
      };
      reader.readAsDataURL(data.value[0]);
    }
  }
  ConvertirImagen(image) {

    if (image) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.urlImage.push(this.getSantizeUrl(event.target.result));
      };
      reader.readAsDataURL(image);
    }
  }
  getSantizeUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  EnviarRetroalimentacion(){
    if (this.ValidarDatos()){
      this.planimetria.UsuarioCrea = this.loginService.Usuario.id;
        this.retroalimetarService.RetroAlimentarPlanimetria(this.planimetria).subscribe(data=>{
          Alertas.ok("","Éxito");
          this.LimpiarControles();
        },error=>{
          Alertas.ok("",error);
        });

        
    }
  }
  ValidarDatos():Boolean {
    if (this.planimetria.TipoPlanimetriaID == 0)
    {
      Alertas.warning("","Ingrese el tipo de planimetría")
      return false;
    }
    if (this.planimetria.SucursalID == 0)
    {
      Alertas.warning("","Ingrese la sucursal.")
      return false;
    }
    if (this.planimetria.Archivos.length == 0)
    {
      Alertas.warning("","Ingrese los archivos de la retroalimentación.")
      return false;
    }
    return true;
  }
  LimpiarControles() {
    this.planimetria = new Planimetria();
    this.archivos = []
    this.urlImage = []
    this.urlImagesRetroalimentacion = []
    $('#inicio').trigger('click');

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

      $wizard.find('.moving-tab').css('width', '50%');
      $('.moving-tab').css({
        'transform': 'translate3d(' + move_distance + 'px, 0, 0)',
        'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'
      });

      $('.moving-tab').css({
        'width': '50%!important',
        'transition': 'transform 0s'
      });
    });

  }
}