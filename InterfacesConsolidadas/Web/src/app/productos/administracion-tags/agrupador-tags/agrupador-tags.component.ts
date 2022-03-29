import { Component, OnInit, Input } from '@angular/core';
import { TagsServiceService } from '../tag-crud-frm/tags-service.service';
import { Tag } from '../tag-crud-frm/models/tag.model';
import { helpers } from '../../../helpers/utils';
@Component({
  selector: 'app-agrupador-tags',
  templateUrl: './agrupador-tags.component.html',
  styleUrls: ['./agrupador-tags.component.css']
})
export class AgrupadorTagsComponent implements OnInit {


  @Input()
  public tags: Tag[] = [];

  public comboTags = {
    value: null,
    selectedItem: this.obtenerTagVacia(),
    data: new Array<Tag>(),
    setValue: (id: number) => {
      setTimeout(() => { this.comboTags.value = id; }, 10);
    },
    fidTagById: (id: number): Tag => {
      let tag = this.comboTags.data.find(el => {
        return el.id == id;
      });
      return tag;
    }
  };

  constructor(private tagsService: TagsServiceService) { }

  ngOnInit() {
    this.cargarTags();
  }

  public cargarTags() {
    this.tagsService.obtenerTags().subscribe(tags => {
      this.comboTags.data = tags;
    });
  }

  public eliminar(tag: Tag) {
    let index = this.getIndex(tag);
    if (index == -1) {
      return;
    }
    tag.esEliminada = true;
  }

  public agregar(id: number) {
    let tag = this.comboTags.fidTagById(id);
    if (tag == undefined) {
      return;
    }

    let index = this.getIndex(tag);
    let esTagAgregada = index > -1;
    if (esTagAgregada) {
      this.tags[index].esEliminada = false;
      return;
    }

    if (!tag.esTagNueva) {
      this.tags.push(tag);
      this.comboTags.value = null;
      return;
    }

    let idRandomActual = tag.id;
    this.tagsService.crearTag({ id: 0, descripcion: tag.descripcion }).subscribe(tagResponse => {
      this.actualizarTagEnCombo(tagResponse, idRandomActual);
      this.tags.push(tagResponse);
      this.comboTags.value = null;
    });
  }

  private getIndex(tag: Tag) {
    return this.tags.findIndex(el => el == tag || el.id == tag.id);
  }

  public limpiar() {
    this.tags.length = 0;
    this.comboTags.value = null;
  }

  public clasesAgregarBtn = [];
  onValueChanged(e) {
    if (e.value == undefined) {
      this.comboTags.selectedItem = {
        id: 0,
        descripcion: "",
        esTagNueva: false
      }
      this.clasesAgregarBtn.length = 0;
      return;
    }

    var item = this.comboTags.fidTagById(e.value);
    this.comboTags.selectedItem = {
      id: item.id,
      descripcion: item.descripcion,
      esTagNueva: item.esTagNueva
    }
    if (item.esTagNueva) {
      this.clasesAgregarBtn.push("add_create-button")
    }
  }

  addCustomItem(data) {
    if (data.text == "") {
      return null;
    }

    let tag = this.comboTags.data.find(el => el.descripcion.toLocaleLowerCase() == data.text.toLocaleLowerCase());
    if (tag != null) {
      this.comboTags.setValue(tag.id);
      return tag;
    }
    return this.agregarTagEnSelectBoxParaPosteriorCreacion(data.text);
  }

  private obtenerTagVacia(): Tag {
    return { id: 0, descripcion: "", esTagNueva: false };
  }

  agregarTagEnSelectBoxParaPosteriorCreacion(descripcion: string): Tag {
    let reandomId = helpers.random(9999) * -1;
    let tag = { id: reandomId, descripcion: descripcion, esTagNueva: true };
    this.comboTags.data.push(tag);
    this.comboTags.setValue(tag.id);
    return tag;
  }

  public modalTagVisible: boolean = false;
  onGuardarTag(tag: Tag) {
    this.modalTagVisible = false;
    this.actualizarTagEnCombo(tag);
  }

  actualizarTagEnCombo(tag: Tag, id:number = 0) {
    if (id == 0) {
      id = tag.id;
    }
    let index = this.comboTags.data.findIndex(el => el.id == id);
    if (index > 0) {
      this.comboTags.data.splice(index, 1);
      setTimeout(() => {
        this.comboTags.data.splice(index, 0, tag);
      }, 10);

      return;
    }

    this.comboTags.data.splice
    this.comboTags.data.push(tag);
  }

}
