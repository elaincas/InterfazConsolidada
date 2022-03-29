import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Tag } from './models/tag.model';
import { TagsServiceService } from './tags-service.service';
import { DxTextBoxComponent } from 'devextreme-angular';

@Component({
  selector: 'app-tag-crud-frm',
  templateUrl: './tag-crud-frm.component.html',
  styleUrls: ['./tag-crud-frm.component.css']
})
export class TagCrudFrmComponent implements OnInit {
  @Input() tag: Tag  = {id: 0, descripcion: "" };
  @Output() onGuardar = new EventEmitter<Tag>();
  @Output() onCancelar = new EventEmitter<void>();

  @ViewChild("txtDescripcion")
  private txtDescripcion:DxTextBoxComponent;

  constructor(private tagsServiceService: TagsServiceService) {
  }

  inicializar(){
    this.tag = {
      id: 0,
      descripcion: ""
    }
    this.txtDescripcion.validator.adapter.reset();
    this.txtDescripcion.isValid = true;
  }

  ngOnInit() {
  }

  public inputDescripcionRules = [
    {
      type: 'required',
      message: 'La descripción es requerida'
    }
  ];

  public guardar(tag: Tag): void {
    this.tagsServiceService.guardar(tag).subscribe(response => {
      this.onGuardar.emit(response);
      this.inicializar();
    });
  }


  public cancelar() {
    this.onCancelar.emit();
    this.inicializar();
  }

}
