import { Injectable } from '@angular/core';
import { Tag } from './models/tag.model';
import { HttpAuthService } from '../../../helpers/http/http-auth.service';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/Observable';
import { Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class TagsServiceService {

  constructor(private httpAuth: HttpAuthService) { }

  guardar(tag: Tag): Observable<Tag> {
    if (!tag.esTagNueva) {
      return this.actualizarTag(tag);
    }
    return this.crearTag(tag);
  }


  actualizarTag(tag: Tag): Observable<Tag> {
    let query = `mutation actualizarTag($id: Int , $desc: String) {
      actualizarTag(id: $id, descripcion: $desc){
          id
          descripcion
        }
    }`;
    let variables = `{ "id": ${tag.id} ,"desc": "${tag.descripcion}" }`;
    let request = {
      query: query,
      variables: variables
    };

    return this.httpAuth.post(environment.graphApi, request).map(res => {
      let response = res.json();
      tag.esTagNueva = false;
      return tag;
    });
  }

  crearTag(tag: Tag): Observable<Tag> {
    let query = `mutation agregarTag($desc: String) {
      agregarTag(descripcion: $desc){
          id
          descripcion
        }
    }`;
    let variables = `{ "desc": "${tag.descripcion}" }`;
    let request = {
      query: query,
      variables: variables
    };

    return this.httpAuth.post(environment.graphApi, request).map(res => {
      let response = res.json();
      return response.data.agregarTag as Tag;
    });
  }

  obtenerTags(): Observable<Array<Tag>> {
    let query = ` query { tags { id descripcion } }`;
    let request = {
      query: query
    };
    return this.httpAuth.post(environment.graphApi, request).map(r => {
      let query = r.json();
      let tags = query.data.tags as Tag[];
      return tags;
    });
  }

}
