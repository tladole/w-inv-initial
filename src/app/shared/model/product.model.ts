import { DropdownField } from "./dropdown-key.model";
import { Country } from "./country.model";
import { ProductSet } from "./product-set.model";

export class Product {
    id: number;
    ProductName: string;
    CategoryId: number;
    UnitOfPackagingId: number;
    UnitsPerPackage: number;
    ExpirationDate: Date;
    ValuePerPackage: number;
    Manufacturer: string;
    ProductCode: string;
    Lot: string;
    CountryOfOriginId: number;
    BarcodeImage: string;
    Set: number[];
    Productimage: string;
}


export class ProductView {
    id: number;
    ProductName: string;
    CategoryId: DropdownField;
    UnitOfPackaging: DropdownField;
    UnitsPerPackage: number;
    ExpirationDate: Date;
    ValuePerPackage: number;
    Manufacturer: string;
    ProductCode: string;
    Lot: string;
    CountryOfOrigin: Country;
    BarcodeImage: string;
    Set: ProductSet[];
    Productimage: string;
}