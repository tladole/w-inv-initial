import { Inventory } from "./inventory.model";

export class ProcurementDetailsView{
    procurementId:number;
    orderNo: number;
    inventory: Inventory;
}


export class ProcurementDetails{
    procurementId:number;
    orderNo: number;
    inventoryId: number;
}