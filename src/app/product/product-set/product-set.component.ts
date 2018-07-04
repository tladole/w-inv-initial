import { Component, OnInit } from '@angular/core';
import { ProductsComponent } from '../products/products.component';
import { ProductSet } from '../../shared/model/product-set.model';

@Component({
  selector: 'app-product-set',
  templateUrl: './product-set.component.html'
})
export class ProductSetComponent implements OnInit {
  prod: ProductSet;

  constructor() { }

  ngOnInit() {
    this.prod = new ProductSet();
  }

}
