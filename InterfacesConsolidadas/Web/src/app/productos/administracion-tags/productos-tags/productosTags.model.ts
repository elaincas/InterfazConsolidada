import { Tag } from "../tag-crud-frm/models/tag.model";
import { IProducto } from "../../agrupador-productos/models/producto.model";

export interface AddProductosTagsDto {
  tags: Tag[],
  productos: IProducto[]
}
