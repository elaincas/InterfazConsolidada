export class ProductToChangePrice implements IProductToChangePrice {
    oldPrice: number;
    name: string;
    productoId: string;
    priceWithDiscount: number;
    senioPriceWithDiscount: number;
    averageCost: number;
    discount: number;
    seniorDiscount: number;
    normalNewPrice: number;
    discountOriginal:number;
    status: number;
    message: string;


}
export interface IProductToChangePrice {
    productoId: string;
    priceWithDiscount: number;
    senioPriceWithDiscount: number;
    averageCost: number;
    discount: number;
    seniorDiscount: number;
    normalNewPrice: number;
    status: number;
    message: string;
    oldPrice: number;
    discountOriginal:number;

    name: string;
}