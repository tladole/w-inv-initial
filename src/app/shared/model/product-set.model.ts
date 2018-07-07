import { Product } from './product.model';
import { User } from 'app/shared/model/admin/user.model';

export class ProductSet {
  id: number;
  Name: string;
  CreatedBy: number;
  ModifiedDate: Date;
  ProductsUnits: ProductsUnits[];
}

export class ProductSetView {
  id: number;
  Name: string;
  CreatedBy: User;
  ModifiedDate: Date;
  ProductsUnits: ProductsUnitsView[];
}

export class ProductsUnits {
  product: number;
  units: number;
}

export class ProductsUnitsView {
  product: Product;
  units: number;
}
