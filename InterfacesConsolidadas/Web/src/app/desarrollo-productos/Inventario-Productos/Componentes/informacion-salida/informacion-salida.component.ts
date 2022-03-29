import { ChangeDetectionStrategy, Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { InventarioProductosImpulsadoService } from '../../services/inventario-service.service';
import { InformacionEntregaRegalia } from '../../_Clases/informacion-entrega-regalia';
import { TrasladosEnviados } from '../../_Clases/TrasladosEnviados';

@Component({
  selector: 'app-informacion-salida',
  templateUrl: './informacion-salida.component.html',
  styleUrls: ['./informacion-salida.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InformacionSalidaComponent implements OnInit, OnChanges {

  _formGrupInfoCliente: FormGroup
  @Input() TrasladosEnviados: TrasladosEnviados;
  @Input() ValidarSalida: boolean = false;
  @Output() informacionSalida = new EventEmitter<InformacionEntregaRegalia>();
  constructor(private formbuilder: FormBuilder, private service: InventarioProductosImpulsadoService) {


  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.ValidarSalida) {
      this.senInfo();
    }
  }

  senInfo(): void {
    let informacion: InformacionEntregaRegalia = this._formGrupInfoCliente.getRawValue();
    informacion.SalidaInventarioTrasladoId = this.TrasladosEnviados.MovimientoDetalleId
    informacion.EsValidaInformacion=this._formGrupInfoCliente.valid;


    this.informacionSalida.emit(informacion);
  }


  ngOnInit() {
    this.crearForm();
  }


  fileDataUri:string;

  ObtenerImagenSeleccionadoDxFileUploader(event: any, edit: boolean = false) {

    if (event.value[0]) {
      const reader = new FileReader();


   this._formGrupInfoCliente.get('ImagenName').setValue(event.value[0].name)     ;

      reader.onload = (event: any) => {
        let fileDataUri = event.target.result;
        this.fileDataUri=event.target.result;
        this._formGrupInfoCliente.get('ImagenBase64').setValue(   fileDataUri.split(',')[1]);
      };
      reader.readAsDataURL(event.value[0]);


    }
  }

  QuitarImagen(event) {
    if (event.value.length == 0) {

      this._formGrupInfoCliente.get('ImagenName').setValue('')
      this._formGrupInfoCliente.get('ImagenBase64').setValue( '');
      this.fileDataUri="";

    }

  }

  crearForm() {
    let date = new Date();
    let dateSinHora: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    this._formGrupInfoCliente = this.formbuilder.group({
      agenteId: new FormControl('', Validators.maxLength(6)),
      identidad: new FormControl('', Validators.maxLength(20)),
      nombre: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(60)])),
      cantidad: new FormControl({ value: 1, disabled: true }, Validators.compose([Validators.required, Validators.min(1)])),
      telefono: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(13)])),

      fechaEntrega: new FormControl(dateSinHora, Validators.compose([Validators.required,Validators.minLength(8)])),
      ImagenBase64: new FormControl('',Validators.compose([Validators.required,Validators.minLength(8)])),
      ImagenName: new FormControl('',Validators.compose([Validators.required,Validators.minLength(3)]))
    })

  }
  onAgenteIdChange(e: any) {
    if (e.value == undefined || e.value == null || e.value == '') {
      return;
    }
    this.limpiarform();
    Alertas.load("Buscando agente");
    this.service.ObtenerAgente(e.value).subscribe(r => {
      Alertas.close();
      if (r.Id != '' && r.Id!=null) {

        this._formGrupInfoCliente.get('identidad').setValue(r.Identidad);
        this._formGrupInfoCliente.get('nombre').setValue(r.Nombre);

        this._formGrupInfoCliente.get('telefono').setValue(r.TelefonoValido);

      } else {
        Alertas.error("Agente no Encontrado")
        this._formGrupInfoCliente.get('agenteId').setValue("");

      }

    })
  }
  limpiarform():void{
     let date = new Date();
    let dateSinHora: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate())
    this._formGrupInfoCliente.get('identidad').setValue('');
    this._formGrupInfoCliente.get('nombre').setValue('');

    this._formGrupInfoCliente.get('fechaEntrega').setValue(dateSinHora);
    this._formGrupInfoCliente.get('telefono').setValue('');
  }
}
