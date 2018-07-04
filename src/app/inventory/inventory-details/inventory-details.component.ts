import { Component, OnInit } from '@angular/core';
import {
  AlertService,
  MessageSeverity,
  DialogType
} from '../../shared/service/alert.service';
import { Inventory } from '../../shared/model/inventory.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Constants } from '../../shared/constants';
import { DropdownField } from '../../shared/model/dropdown-key.model';
import { ColDef } from 'ag-grid';
import { AgDropdownGenEditorComponent } from '../../shared/component/ag-dropdown-gen-editor/ag-dropdown-gen-editor.component';

@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.component.html',
  styleUrls: ['./inventory-details.component.css']
})
export class InventoryDetailsComponent implements OnInit {
  prod: Inventory;
  orgProd: Inventory;
  prodId: number;
  products: any;
  teams: any;
  warehouse: any;
  records: any;

  columnDefs: ColDef[] = [
    {
      headerName: 'Category Name', field: 'productId',
      valueFormatter: data => {
        const p = this.products.filter(a => a.id == data.value)[0];
        const d = this.category.filter(a => a.id == p.CategoryId)[0];
        return d.Name;
      },
      getQuickFilterText: params => {
        const p = this.products.filter(a => a.id == params.value)[0];
        const d = this.category.filter(a => a.id == p.CategoryId)[0];
        return d.Name;
      }
    },
    {
      headerName: 'Product Name', field: 'productId',
      valueFormatter: data => {
        const d = this.products.filter(a => a.id == data.value)[0];
        return d.ProductName;
      },
      getQuickFilterText: params => {
        const d = this.products.filter(a => a.id == params.value)[0];
        return d.ProductName;
      }
    },
    {
      headerName: 'Department', field: 'DepartmentId', editable: true,
      cellEditorFramework: AgDropdownGenEditorComponent,
      cellEditorParams: params => {
        return { values: this.teams, valueToShow: 'TeamName' }; //.map(u => u.Name)
      },
      valueParser: params => {
        return this.teams.filter(a => a.Name == params.newValue)[0].id;
      },
      valueFormatter: data => {
        const d = this.teams.filter(a => a.id == data.value)[0];
        return d?d.TeamName:'';
      },
      getQuickFilterText: params => {
        const d = this.teams.filter(a => a.id == params.value)[0];
        return d?d.TeamName:'';
      }
    },
    {
      headerName: 'Warehouse', field: 'WareHouseId', editable: true,
      cellEditorFramework: AgDropdownGenEditorComponent,
      cellEditorParams: params => {
        return { values: this.warehouse }; //.map(u => u.Name)
      },
      valueParser: params => {
        return this.warehouse.filter(a => a.Name == params.newValue)[0].id;
      },
      valueFormatter: data => {
        const d = this.warehouse.filter(a => a.id == data.value)[0];
        return d.Name;
      },
      getQuickFilterText: params => {
        const d = this.warehouse.filter(a => a.id == params.value)[0];
        return d.Name;
      }
    },
    { headerName: 'Total Packages Needed', field: 'TotalPackagesNeeded', editable: true },
    { headerName: 'Total Packages Available', field: 'TotalPackagesAvailable', editable: true },
    { headerName: 'Total Packages Outstanding', field: 'TotalPackagesOutstanding', editable: true }
  ];
  category: DropdownField[];
  CategoryId: number;

  constructor(private http: HttpClient, private alertService: AlertService, private router: Router, public activeRoute: ActivatedRoute) {
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
      .get(Constants.apiUrl + '/warehouse')
      .subscribe((data: any) => {
        console.log(data)
        this.warehouse = data;
      });
    this.http
      .get(Constants.apiUrl + '/category')
      .subscribe((data: DropdownField[]) => {
        console.log('in category', data)
        this.category = data;
      });
    this.prod = new Inventory();
    this.activeRoute.params.subscribe((params: Params) => {
      console.log(params);
      this.prodId = params['id'];
      if (this.prodId) {
        this.http
          .get(Constants.apiUrl + '/inventory')
          .subscribe((data: any) => {
            let records = data.filter(a => a.id == this.prodId);
            this.CategoryId= this.products.filter(a => a.id == this.prodId)[0].CategoryId;
            let grouped = data.filter(a => a.productId == records[0].productId).reduce(function (res, obj) {
              if (!(obj.productId in res))
                res.__array.push(res[obj.productId] = obj);
              else {
                res[obj.productId].TotalPackagesAvailable = parseInt(res[obj.productId].TotalPackagesAvailable) + parseInt(obj.TotalPackagesAvailable);
                res[obj.productId].TotalPackagesNeeded = parseInt(res[obj.productId].TotalPackagesNeeded) + parseInt(obj.TotalPackagesNeeded);
                res[obj.productId].TotalPackagesOutstanding = parseInt(res[obj.productId].TotalPackagesOutstanding) + parseInt(obj.TotalPackagesOutstanding);
              }
              return res;
            }, { __array: [] }).__array
              .sort(function (a, b) { return parseInt(b.TotalPackagesOutstanding) - parseInt(a.TotalPackagesOutstanding); });
            console.log('grouped', grouped)
            this.prod = grouped[0];
            this.orgProd = Object.assign({}, this.prod);
          });
      } else {
        this.prod = new Inventory();
      }
    });
  }

  onGridReady(params) {
    this.http
      .get(Constants.apiUrl + '/inventory')
      .subscribe((data: Inventory[]) => {
        this.records = data.filter(a => a.productId == this.prod.productId);
      });
  }


  saveAll() {
    this.http
      .get(Constants.apiUrl + '/inventory')
      .subscribe((data: Inventory[]) => {
        let rowDataOrg = JSON.parse(JSON.stringify(data));
        let savingRec = new Array();
        console.log('start save all', this.records, data)
        this.records.forEach(rec => {
          if (rowDataOrg.filter(a => a.id == rec.id).length > 0) {
            const org1 = rowDataOrg.filter(a => a.id == rec.id)[0];
            Object.keys(rec).forEach(key => {
              if (org1[key] != rec[key]) {
                if (savingRec.filter(a => a.id == rec.id).length == 0) {
                  savingRec.push(rec);
                  return;
                }
              }
            });
          }
        });
        console.log("bulk save", savingRec)
        const headers = new HttpHeaders()
          .append('Content-Type', 'application/json');
        savingRec.forEach(element => {
          this.http.put(Constants.apiUrl + '/inventory/' + element.id, JSON.stringify(element), { headers: headers })
            .subscribe((data: Inventory) => {
              console.log('product', data);
              this.alertService.showMessage('Save', `inventory updated successfully.`, MessageSeverity.success);
              //this.prod = data;
            });
        });
        this.router.navigate(['inventory']);
      });
  }

  cancelAll() {
    this.prod = Object.assign({}, this.orgProd);
    console.log(this.prod);
  }

  deleteProd() {
    this.http.delete(Constants.apiUrl + '/inventory/' + this.prodId)
      .subscribe((data: Inventory) => {
        console.log('product', data);
        this.router.navigate(['/inventory']);
        //this.prod = data;
      });

  }

}
