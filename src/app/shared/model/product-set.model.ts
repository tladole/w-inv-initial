import { Product } from "./product.model";

export class ProductSet {
    id: number;
    SetName: string;
    ProductsUnits: [{ productId: number, units: number }];
}


export class ProductSetView {
    id: number;
    SetName: string;
    ProductsUnits: [{ product: Product, units: number }];
}