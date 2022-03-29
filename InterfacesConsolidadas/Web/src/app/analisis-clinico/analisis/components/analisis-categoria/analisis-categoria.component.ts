import { Component, OnInit } from '@angular/core';
import { Forms } from '../../../../helpers/forms';
import { Alertas } from '../../../../helpers/notificaciones/notificaciones';
import { ACTipoRespuesta } from '../../enums/TipoRespuesta';
import { MensajesGenericosAC } from '../../helpers/mensajes';
import { stringAc } from '../../helpers/stringFormat';
import { Categoria } from '../../models/categorias.model';
import { RespuestaAC } from '../../models/respuestaAC';
import { RespuestaModal } from '../../models/respuestaModal';
import { AnalisisCategoriasService } from '../../services/analisisCategoriaService';

@Component({
  selector: 'app-analisis-categoria',
  templateUrl: './analisis-categoria.component.html',
  styleUrls: ['./analisis-categoria.component.css']
})
export class AnalisisCategoriaComponent implements OnInit {

  analisisCategorias: Categoria[];
  modo: Forms.Modo = Forms.Modo.Agregar;
  mostrarPopUp: boolean = false;
  categoria: Categoria = new Categoria;
  titulo:string;
  constructor(private analisisCategoriasService: AnalisisCategoriasService) { }

  ngOnInit() {
    this.GetAllCategorias();
  }

  GetAllCategorias(): void {
    this.analisisCategoriasService.ObtenerCategorias().subscribe(data => {
      this.analisisCategorias = data as Categoria[];
    }, error =>{
      Alertas.errorEnServidor();
    });
  }

  EliminarCategoria(categoria: Categoria): void {
    let msgDelete = MensajesGenericosAC.eliminar;
    Alertas.question(msgDelete).then(response => {
        this.analisisCategoriasService.EliminarCategoria(categoria.id).subscribe(response => {
          let respuesta = response as RespuestaAC<Categoria>;
          if (respuesta.respuestaTipo == ACTipoRespuesta.Ok) {
            Alertas.info(respuesta.data.mensaje);
            categoria.activo = false;
          }else{
            let titulo = respuesta.respuestaTipo == ACTipoRespuesta.Error ? MensajesGenericosAC.error:MensajesGenericosAC.errorValidacion;
            Alertas.error(titulo,respuesta.mensaje);
          }
        }, error =>{
          Alertas.errorEnServidor();
        });
    });
  }

  EditarCategoria(categoria: Categoria): void {
    this.mostrarPopUp = true;
    this.categoria = categoria;
    this.modo = Forms.Modo.Actualizar;
    this.titulo = "Editar Categoría";
  }

  NuevoCategoria(): void {
    this.mostrarPopUp = true;
    this.modo = Forms.Modo.Agregar;
    this.titulo = "Nueva Categoría";
  }

  ControlEventoModal(respuestaModal: RespuestaModal<Categoria>){
    if(respuestaModal.tipo == ACTipoRespuesta.Ok){
      if(respuestaModal.modo == Forms.Modo.Agregar){
        this.analisisCategorias.push(respuestaModal.data);
      }else{
        let categoria = this.analisisCategorias.find(i => i.id == respuestaModal.data.id);
        categoria.descripcion = respuestaModal.data.descripcion;
      }
    }
  }

}
