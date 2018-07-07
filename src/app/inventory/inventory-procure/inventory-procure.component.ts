import { Component, OnInit } from '@angular/core';
import { Inventory } from '../../shared/model/inventory.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProcurementSet, ProcurementSetView } from '../../shared/model/invetory-procurment-set.model';
import { ProcurementDetails, ProcurementDetailsView } from '../../shared/model/invetory-procurment.model';
import { Product } from '../../shared/model/product.model';
import { Constants } from '../../shared/constants';

@Component({
  selector: 'app-inventory-procure',
  templateUrl: './inventory-procure.component.html'
})
export class InventoryProcureComponent implements OnInit {
  prods: ProcurementSetView;
  prod: Inventory;
  orgProd: Inventory;
  prodId: number;
  products: any;
  teams: any;
  unitofpacking: any;
  category: any;

  constructor(private http: HttpClient, private router: Router, public activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.http
      .get(Constants.apiUrl + '/products')
      .subscribe((data: any) => {
        console.log(data)
        this.products = data;
      });
    this.http
      .get(Constants.apiUrl + '/teams')
      .subscribe((data: any) => {
        console.log(data)
        this.teams = data;
      });
    this.http
      .get(Constants.apiUrl + '/unitofpacking')
      .subscribe((data: any) => {
        console.log(data)
        this.unitofpacking = data;
      });
    this.http
      .get(Constants.apiUrl + '/category')
      .subscribe((data: any) => {
        console.log(data)
        this.category = data;
      });
    this.prods = new ProcurementSetView();
    this.prods.procuments = new Array();
    const a = new ProcurementDetailsView();
    a.procurementId = this.prods.procuments.length;
    a.orderNo = 0;
    a.inventory = new Inventory();
    this.prods.procuments.push(a);
    this.prod = new Inventory();
    this.activeRoute.params.subscribe((params: Params) => {
      console.log(params);
      this.prodId = params['id'];
      if (this.prodId) {
        this.http.get(Constants.apiUrl + '/inventory')
          .subscribe((data: any) => {
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
      this.http.put(Constants.apiUrl + '/inventory/' + this.prodId, JSON.stringify(this.prod), { headers: headers })
        .subscribe((data: Inventory) => {
          console.log('product', data);
          this.router.navigate(['requisition']);
          // this.prod = data;
        });
    } else {
      console.log(this.prod);
      this.http
        .get(Constants.apiUrl + '/inventory')
        .subscribe((data: Inventory[]) => {
          this.prod.id = Math.max.apply(Math, data.map(function (o) { return o.id; }));
          this.prod.id = this.prod.id + 2;
          console.log(this.prod);
          this.http.post(Constants.apiUrl + '/inventory', JSON.stringify(this.prod), { headers: headers })
            .subscribe((data1: Inventory) => {
              console.log('product saved', data);
              this.router.navigate(['requisition']);
            });
        });
    }

  }
  cancelAll() {
    this.prod = Object.assign({}, this.orgProd);
    console.log(this.prod);
    this.router.navigate(['requisition']);
  }

  deleteProd() {
    this.http.delete(Constants.apiUrl + '/inventory/' + this.prodId)
      .subscribe((data: Inventory) => {
        console.log('product', data);
        this.router.navigate(['requisition']);
        // this.prod = data;
      });

  }
  addInv() {
    console.log(this.prods)
    const a = new ProcurementDetailsView();
    a.procurementId = this.prods.procuments.length;
    a.orderNo = 0;
    a.inventory = new Inventory();
    this.prods.procuments.push(a);
    this.prods.procuments.sort((a1, b) => {
      if (a1.procurementId < b.procurementId) { return -1; } else if (a1.procurementId > b.procurementId) { return 1; } else { return 0; }
    });
  }

  AddTeam(pro: ProcurementDetailsView) {
    const a = new ProcurementDetailsView();
    a.procurementId = pro.procurementId;
    a.orderNo = this.prods.procuments.filter(a1 => a.procurementId == pro.procurementId).length;
    a.inventory = new Inventory();
    this.prods.procuments.push(a);
    this.prods.procuments.sort((a1, b) => {
      if (a1.procurementId < b.procurementId) { return -1; } else if (a1.procurementId > b.procurementId) { return 1; } else { return 0; }
    });
  }

  onChange(event: any, pro: ProcurementDetailsView) {
    console.log(pro, event)
    pro.inventory.TotalPackagesOutstanding = parseFloat(event.target.value);
    const bb = null;
    let result = 0;
    this.prods.procuments.filter(a => a.procurementId == pro.procurementId && a.orderNo != 0)
      .map(item => item.inventory.TotalPackagesOutstanding)
      .forEach((val) => result += val);
    console.log(this.prods.procuments.filter(a => a.procurementId == pro.procurementId && a.orderNo == 0), result)
    this.prods.procuments
      .filter(a => a.procurementId == pro.procurementId && a.orderNo == 0)[0].inventory.TotalPackagesOutstanding = result;

  }
}
