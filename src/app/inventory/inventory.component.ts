import { Component, OnInit } from '@angular/core';
import { Inventory } from '../shared/model/inventory.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Constants } from '../shared/constants';
import { DropdownField } from '../shared/model/dropdown-key.model';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  columnDefs = [
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
    { headerName: 'Total Packages Needed', field: 'TotalPackagesNeeded' },
    { headerName: 'Total Packages Available', field: 'TotalPackagesAvailable' },
    { headerName: 'Total Packages Outstanding', field: 'TotalPackagesOutstanding' }
  ];

  private gridApi;
  private gridColumnApi;
  rowData: any;
  public rowSelection;
  warehouse: any;
  teams: any;
  products: any;
  category: DropdownField[];

  public constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.rowSelection = "single";
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
  }
  onSelectionChanged(event: any) {
    var selectedRows = this.gridApi.getSelectedRows();
    var selectedRowsString = "";
    console.log(selectedRows);
    selectedRows.forEach(function (selectedRow, index) {
      if (index !== 0) {
        selectedRowsString += ", ";
      }
      selectedRowsString += selectedRow.model;
    });
    this.router.navigate(['inventory/details/', selectedRows[0].id])
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = new Array();

    this.http
      .get(Constants.apiUrl + '/inventory')
      .subscribe((data: any) => {
        let filterData = data.filter(a => a.missionId == Constants.missionName.id);
        let grouped = filterData.reduce(function (res, obj) {
          if (!(obj.productId in res))
            res.__array.push(res[obj.productId] = obj);
          else {
            res[obj.productId].TotalPackagesAvailable = parseInt(res[obj.productId].TotalPackagesAvailable) + parseInt(obj.TotalPackagesAvailable);
            res[obj.productId].TotalPackagesNeeded = parseInt(res[obj.productId].TotalPackagesNeeded) + parseInt(obj.TotalPackagesNeeded);
            res[obj.productId].TotalPackagesOutstanding = parseInt(res[obj.productId].TotalPackagesOutstanding) + parseInt(obj.TotalPackagesOutstanding);
          }
          return res;
        }, { __array: [] }).__array
          .sort(function (a, b) { return b.TotalPackagesOutstanding - a.TotalPackagesOutstanding; });
        console.log('grouped', grouped)
        this.rowData = grouped;
      });
  }

  onQuickFilterChanged(event) {
    console.log(event);
    this.gridApi.setQuickFilter(event.data);
  }

}

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};