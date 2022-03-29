export class Monitoreotransacciones {
  constructor(
    public sucursal: string = "",
    public cantidad: number=0
    ){


}
toJson():string{
    let objeto = {
      sucursal:this.sucursal,
      cantidad:this.cantidad
    };

    return JSON.stringify(objeto);
}
}