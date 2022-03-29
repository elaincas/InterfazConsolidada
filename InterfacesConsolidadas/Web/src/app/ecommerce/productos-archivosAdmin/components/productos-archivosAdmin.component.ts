import { OnInit, OnChanges, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { Component } from '@angular/core';
import { nextTick } from "process";
import { ArchivoExcelEImagenes, Archivos } from "../../../desarrollo-productos/Planimetrias/Clases/Archivos";
import { TiposArchivos } from "../../../desarrollo-productos/Planimetrias/Clases/EnumArchivo";
import { Producto } from "../../../entrenamiento/administracion-productos/Clases/Producto";
import { AceptarDenegarTrasladoService } from "../../../entrenamiento/administracion-productos/Componentes/Traslados/aceptar-denegar-traslado.service";
import { Alertas } from "../../../helpers/notificaciones/notificaciones";
import { LoginService } from "../../../login/services/login.service";
import { ProductoArchivo } from "../models/productoarchivo";
import { ProductoArchivoService } from "../productos-archivosAdmin.service";

// import { LoginService } from "../../../../login/services/login.service";
// import { Planimetria } from "../../Clases/Planimetria";
// import { IngresarPlanimetriaService } from "./ingresar-planimetria.service";
// import { DxDataGridComponent, DxFileUploaderComponent } from "devextreme-angular";
// import { Archivos, ArchivoExcelEImagenes } from "../../Clases/Archivos";
// import { TiposArchivos } from "../../Clases/EnumArchivo";
// import { Alertas } from "../../../Inventario-Productos/helpers/notificaciones/notificacion";
// import { Sucursales } from "../../Clases/Sucursales";
declare var $: any;


@Component({
  selector: 'app-productoarchivoadmin',
  templateUrl: './productos-archivosAdmin.component.html',
  styleUrls: ['./productos-archivosAdmin.component.css']
})
export class ProductosArchivosAdminComponent implements OnInit, OnChanges, AfterViewInit {


  sucursales: any[]
  tiposPlanimetrias: any[]
  productosArchivo: ProductoArchivo;
  slideshowDelay = 2000;
  SelectedFiles = [];
  urlImage = [];
  mostrarVideo = true;
  producto: any[];
  archivos: ArchivoExcelEImagenes[]
  archivosAMandar: ArchivoExcelEImagenes[]
  usuarioID: number;
  _mensajeArchivo: string;
  _mostrarPopup: boolean = false;
  dataVideo: any;
  tipoPlanimetriaDescripcion: string = "";
  tags: any[];
  inProgress = false;
  seconds = 5;
  maxValue = 5;
  intervalId: any;
  mostrarBarra = false;
  seEliminarVideoQueYaExisteEnServidor: boolean = false;
  _mostrarPopupTipoPlanimetria: boolean = false;
  constructor(private loginService: LoginService, private ecommerceMultimediaService: ProductoArchivoService, private trasladoService: AceptarDenegarTrasladoService) {
    this.sucursales = new Array<any>();
    this.tiposPlanimetrias = new Array<any>();
    this.archivos = new Array<ArchivoExcelEImagenes>()
    this.productosArchivo = new ProductoArchivo();
    this.usuarioID = this.loginService.Usuario.id;
    this.archivosAMandar = new Array<ArchivoExcelEImagenes>();
    this.producto = [];
    ;
    this.ObtenerProductos();
    this.ObtenerTags();
    this.mostrarVideo = false;
    this.tags = [];

  }


  subirArvhivoImagen(data) {
    
    let archivoImagen;

    if (data.value[0]) {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        if (data.value[0].type != "video/mp4") {

          this.urlImage.push(event.target.result);
        }else{
          this.seEliminarVideoQueYaExisteEnServidor = false;
        }
        archivoImagen = new ArchivoExcelEImagenes(new Archivos(0, '', TiposArchivos.Imagen, data.value[0].name, data.value, this.usuarioID, null, null, this.archivos.length + 1), null);
        archivoImagen.OrdenId = this.archivos.length + 1;
        archivoImagen.Alt = "Farmacia Simán";
        archivoImagen.ArchivoImagen.TipoArchivoID = 2;

        this.archivos.push(archivoImagen);

      };
      reader.readAsDataURL(data.value[0]);


      if (data.value[0].type == "video/mp4") {
        this.dataVideo = data.value[0];
        this.mostrarVideo = true;
      }
    }
  }

  limpiar() {
    this.archivos = [];
    this.archivosAMandar = [];
    this.mostrarVideo = false;
    this.productosArchivo = new ProductoArchivo();
    this.urlImage = [];
    this.seEliminarVideoQueYaExisteEnServidor = false;
    this.dataVideo = undefined;
    this.mostrarBarra = false;

  }
  subirArvhivoVideo(dataEvento, dataFila) {
    let archivoVideo;
    if (dataEvento.value[0]) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        archivoVideo = new ArchivoExcelEImagenes(null, new Archivos(0, '', TiposArchivos.Video, dataEvento.value[0].name, dataEvento.value, this.usuarioID));
        dataFila.ArchivoVideo = archivoVideo.ArchivoVideo;
      };
      reader.readAsDataURL(dataEvento.value[0]);
    }
  }
  ObtenerArchviosProductoSeleccionado() {


    if (this.productosArchivo.ProductoId == "") {
      return;
    }
    this.ecommerceMultimediaService.ObtenerUrlPRoductoSeleccionado(this.productosArchivo.ProductoId).subscribe(data => {

      this.urlImage = [];
      this.archivos = [];
      this.archivosAMandar = [];
      this.dataVideo = undefined;
      
      if (this.mostrarVideo){
        this.LimpiarSRCVideo();
      }

      for (let el of data) {
        debugger;

        let blob = new Array<Blob>();
        let archivoImage = new File(blob, "ArchivoImagenServer", { type: 'image/jpg' });
        let files = new Array<File>();
        files.push(archivoImage);
        let filesany: any;
        filesany = files;
        let archivoImagen = new ArchivoExcelEImagenes(new Archivos(0, '', TiposArchivos.Imagen, this.productosArchivo.ProductoId, filesany, this.usuarioID, null, null, this.archivos.length + 1), null);
        if (!el.productoUrl.includes(".mp4")) {
          this.urlImage.push(el.productoUrl);
        }
        if (el.productoUrl.includes(".mp4")) {
          this.mostrarVideo = true;
          archivoImagen.ArchivoImagen.Observaciones = "Video En Servidor";
          archivoImagen.ArchivoImagen.TipoArchivoID = 2;
          var video = el.productoUrl.includes(".mp4");
          if (video) {
            this.dataVideo = el.productoUrl;

          };

        }
        archivoImagen.OrdenId = this.archivos.length + 1;
        this.archivos.push(archivoImagen);
      }
    })

  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader(); //you need file reader for read blob data to base64 image data.
    reader.addEventListener("load", () => {
      this.urlImage.push(reader.result); // here is the result you got from reader
    }, false);

    reader.readAsDataURL(image);
  }

  LimpiarSRCVideo() {
    var videoPlayer1 = document.querySelector('video')
    videoPlayer1.src = null;
    this.mostrarVideo= false;
  }
  EliminarFila(data) {
    debugger;
    if (data.data.ArchivoImagen.TipoArchivoID == 2) {
      this.dataVideo = undefined;
      this.LimpiarSRCVideo();
      if (data.data.ArchivoImagen.Observaciones == "Video En Servidor") {
        this.seEliminarVideoQueYaExisteEnServidor = true;
      }
    }
    this.archivos.splice(data.rowIndex, 1);
    this.archivosAMandar.splice(data.rowIndex, 1);
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
    this.productosArchivo.Archivos = this.archivos;
    if (this.seEliminarVideoQueYaExisteEnServidor) {
      this.MostrarVideo(true);
    }
    else {
      this.MostrarVideo(false);
    }
    this._mostrarPopup = false;
  }
  MostrarVideo(VideoDelServidor: boolean = false) {
    if (this.dataVideo == undefined) {
      return;
    }
    debugger;
    var URL = window.URL
    this.mostrarVideo = true;

    try {
      if (this.dataVideo.toString().includes("http")){
        VideoDelServidor = true;
      }
    } catch (error) {
      VideoDelServidor = false;
    } 


    var videoPlayer1 = document.querySelector('video')
    var fileUrl;
    if (!VideoDelServidor ) {
      this.dataVideo = URL.createObjectURL(this.dataVideo)
    }
    fileUrl = this.dataVideo;
    videoPlayer1.src = fileUrl;
  }
  MostrarPopupTipoPlanimetrias(seDeseaMostrarPopup) {
    if (seDeseaMostrarPopup == 1) {
      this._mostrarPopupTipoPlanimetria = true;
      return;
    }
    this._mostrarPopupTipoPlanimetria = false;
  }
  GuardarDatos() {

    debugger;
    if (!this.ValidarDatos())
      return;
    this.productosArchivo.UsuarioCrea = this.usuarioID;
    this.productosArchivo.Archivos = this.archivos;
    debugger;

    this.ecommerceMultimediaService.AgregarArchivo(this.productosArchivo).subscribe(data => {
      this.mostrarBarra = true;
      if (this.inProgress) {
        clearInterval(this.intervalId);

      } else {

        if (this.seconds === 0) {
          this.seconds = 5;
        }
        this.intervalId = setInterval(() => this.timer(), 1000);

      }
      this.inProgress = !this.inProgress;

    }, error => {
      this.mostrarBarra = true;
      if (this.inProgress) {
        clearInterval(this.intervalId);

      } else {

        if (this.seconds === 0) {
          this.seconds = 5;
        }
        this.intervalId = setInterval(() => this.timer(), 1000);

      }
      this.inProgress = !this.inProgress;

      Alertas.ok("Datos Guardados Exitosamente");
      this.limpiar();

    });

  }

  ValidarDatos(): Boolean {
    var hayOrdenMalIngresado = this.archivos.filter((x) => x.ArchivoImagen.OrdenId === 0);
    if (hayOrdenMalIngresado.length > 0) {
      Alertas.warning("Debe asignar un orden a todos los archivos ingresados")
      return false;
    }
    for (let el of this.archivos) {

      var OrdenId = el.ArchivoImagen.OrdenId
      var archivosConMismoOrden = this.archivos.filter((x) => x.ArchivoImagen.OrdenId == OrdenId);
      if (archivosConMismoOrden.length > 1 || OrdenId <= 0 || isNaN(OrdenId)) {
        Alertas.warning("Hay archivos que el orden ingresado es repetido o no es correcto")
        return false;
      }
      return true;
    }

    if (this.productosArchivo.ProductoId == "") {
      Alertas.warning("Favor seleccione un producto")
      return false;
    }

    return true;
  }
  LimpiarControles() {
    this.productosArchivo = new ProductoArchivo();
    this.archivos = []
    this.urlImage = []
    $('#inicio').trigger('click');

  }

  ObtenerProductos() {
    this.ecommerceMultimediaService.ObtenerProductos().subscribe(data => {
      this.producto = data;
    })
  }
  ObtenerTags() {
    this.ecommerceMultimediaService.ObtenerTags().subscribe(data => {
      this.tags = data;
    })
  }
  timer() {
    this.seconds--;
    if (this.seconds == 0) {
      this.inProgress = !this.inProgress;
      clearInterval(this.intervalId);
      Alertas.ok("Archivos Guardados");
      this.limpiar();

      return;
    }
  }
  format(value) {
    return 'Cargando: ' + value * 100 + '%';
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
