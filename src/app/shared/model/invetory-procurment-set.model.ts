import { ProcurementDetails, ProcurementDetailsView } from "./invetory-procurment.model";

export class ProcurementSet{
    id: number;
    procuments: number[];
}


export class ProcurementSetView{
    id: number;
    procuments: ProcurementDetailsView[];
}