import { Patient } from "./patient.model";
import { ProductSet } from "./product-set.model";

export class PatientCaseInventory{
    id: number;
    patient: Patient;
    ProductSetUnits: [{ productSet: ProductSet, units: number }];
}