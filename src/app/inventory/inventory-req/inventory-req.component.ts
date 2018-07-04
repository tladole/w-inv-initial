import { Component, OnInit } from '@angular/core';
import { Inventory } from '../../shared/model/inventory.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Constants } from '../../shared/constants';

@Component({
  selector: 'app-inventory-req',
  templateUrl: './inventory-req.component.html'
})
export class InventoryReqComponent implements OnInit {
  prod: Inventory;
  orgProd: Inventory;
  prodId: number;

  constructor(private http: HttpClient, private router: Router, private activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.prod = new Inventory();
    this.activeRoute.params.subscribe((params: Params) => {
      console.log(params);
      this.prodId = params['id'];
      if (this.prodId) {
        this.http.get(Constants.apiUrl + '/products/' + this.prodId)
          .subscribe((data: Inventory) => {
            console.log('product', data);
            this.prod = data;
            this.orgProd = Object.assign({}, this.prod);
          });
      } else {
        this.prod = new Inventory();
      }
    });
  }

  saveProduct() {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');
    if (this.prodId) {
      this.http.put(Constants.apiUrl + '/products/' + this.prodId, JSON.stringify(this.prod), { headers: headers })
        .subscribe((data: Inventory) => {
          console.log('product', data);
          this.router.navigate(['/products']);
          //this.prod = data;
        });
    } else {
      console.log(this.prod);
      this.http
        .get(Constants.apiUrl + '/products')
        .subscribe((data: Inventory[]) => {
          this.prod.id = Math.max.apply(Math, data.map(function (o) { return o.id; }));
          this.prod.id = this.prod.id + 2;
          console.log(this.prod);
          this.http.post(Constants.apiUrl + '/products', JSON.stringify(this.prod), { headers: headers })
            .subscribe((data1: Inventory) => {
              console.log('product saved', data);
              this.router.navigate(['/products']);
            });
        });
    }

  }
  cancelAll() {
    this.prod = Object.assign({}, this.orgProd);
    console.log(this.prod);
  }

  deleteProd() {
    this.http.delete(Constants.apiUrl + '/products/' + this.prodId)
      .subscribe((data: Inventory) => {
        console.log('product', data);
        this.router.navigate(['/products']);
        //this.prod = data;
      });

  }
}
