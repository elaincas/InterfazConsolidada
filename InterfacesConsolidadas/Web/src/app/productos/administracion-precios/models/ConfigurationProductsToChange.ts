import { ProductToChangePrice } from "./ProductToChangePrice.model";

export class ConfigurationProductsToChange implements IConfigurationProductsToChange {
    id:number;
    oldList: number;
    replaceList: boolean;
    description: string;
    username: string;
    userId: number;
    smallerMargin: number;
    dateChange: string | Date;
    products: ProductToChangePrice[];
    updateNow:boolean;
    typeChangePrice:number;
}
export interface IConfigurationProductsToChange {
  id:number;
    userId:number;
    username:string;
    smallerMargin: number;
    dateChange: Date | string;
    products: ProductToChangePrice[];
    updateNow: boolean;
    typeChangePrice:number;
    description:string;
    oldList:number;
    replaceList:boolean;
}