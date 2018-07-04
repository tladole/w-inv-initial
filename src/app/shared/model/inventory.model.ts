import { Product } from "./product.model";
import { WareHouse } from "./warehouse.model";
import { Team } from "./admin/team.model";

export class Inventory{
    id:number;
    WareHouseId: number;
    DepartmentId: number;
    productId: number;
    TotalPackagesNeeded: number;
    TotalPackagesAvailable: number;
    TotalPackagesOutstanding: number;
}


export class InventoryView{
    id:number;
    WareHouse: WareHouse;
    Department: Team;
    product: Product;
    TotalPackagesNeeded: number;
    TotalPackagesAvailable: number;
    TotalPackagesOutstanding: number;
}