import { Tag } from "../../tag-crud-frm/models/tag.model";
export interface ProductoTag {
  id: string;
  descripcion: string;
  tags: Tag[];
  productosSimilares?: ProductoTag[];
  contieneLasMismasTagsDelProductoPrincipal?: boolean;
  esSeleccionado?: boolean;
  countProductosSimilares:number;
  countTags:number;
}
