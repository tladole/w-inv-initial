import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { ColDef, GridOptions } from 'ag-grid';
import { ProductSet } from '../../shared/model/product-set.model';
import { AgDropdownGenEditorComponent } from '../../shared/component/ag-dropdown-gen-editor/ag-dropdown-gen-editor.component';
import { AgDateGenEditorComponent } from '../../shared/component/ag-date-gen-editor/ag-date-gen-editor.component';
import { Constants } from '../../shared/constants';
import { Product } from '../../shared/model/product.model';
import { MessageSeverity, AlertService } from '../../shared/service/alert.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-set',
  templateUrl: './product-set.component.html'
})
export class ProductSetComponent implements OnInit {
  users: any;
  gridOptions: GridOptions = {
    context: { curr: this }
  };
  columnDefs: ColDef[] = [
    { headerName: 'Set Name', field: 'Name', pinned: true, width: 300 },
    {
      headerName: 'Created By', field: 'CreatedBy',
      valueFormatter: data => {
        const d = this.users.filter(a => a.id == data.value)[0];
        return d.UserName;
      },
      getQuickFilterText: params => {
        const d = this.users.filter(a => a.id == params.value)[0];
        return d.UserName;
      }
    },
    {
      headerName: 'Modified Date', field: 'ModifiedDate',
      valueFormatter: data => {
        const d = new Date(data.value);
        console.log('day', data.value, d, d.getDate(), d.getDate().toString()[1]);
        const day = d.getDate().toString()[1] ? d.getDate().toString() : '0' + d.getDate().toString();
        const month = (d.getMonth() + 1).toString()[1] ? (d.getMonth() + 1).toString() : '0' + (d.getMonth() + 1).toString();
        return (new Date(data.value)).getFullYear() + '-' + month + '-' + day;
      }
    }
  ];

  private gridApi;
  private gridColumnApi;
  rowData: any;
  rowDataOrg: any;
  public rowSelection;
  unitofpacking: any;
  category: any;
  country: any;

  public constructor(private http: HttpClient,
    private alertService: AlertService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.rowSelection = 'single';
    this.http
      .get(Constants.apiUrl + '/users')
      .subscribe((data: any) => {
        console.log(data);
        this.users = data;
      });
    this.http
      .get(Constants.apiUrl + '/unitofpacking')
      .subscribe((data: any) => {
        console.log(data);
        this.unitofpacking = data;
      });
    this.http
      .get(Constants.apiUrl + '/category')
      .subscribe((data: any) => {
        console.log(data);
        this.category = data;
      });
    this.http
      .get(Constants.apiUrl + '/country')
      .subscribe((data: any) => {
        console.log(data);
        this.country = data;
      });
  }
  onSelectionChanged(event: any) {
    const selectedRows = this.gridApi.getSelectedRows();
    let selectedRowsString = '';
    console.log(selectedRows);
    selectedRows.forEach(function (selectedRow, index) {
      if (index !== 0) {
        selectedRowsString += ', ';
      }
      selectedRowsString += selectedRow.model;
    });
    this.router.navigate(['products/sets/details/', selectedRows[0].id]);
  }

  updateOther() {
    const selectedRows = this.gridApi.getSelectedRows();
    console.log(selectedRows);
    this.router.navigate(['products/details/', selectedRows[0].id]);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = new Array();

    this.http
      .get(Constants.apiUrl + '/productset')
      .subscribe((data: ProductSet[]) => {
        this.rowData = data;
        this.rowDataOrg = JSON.parse(JSON.stringify(data));
        this.gridApi.sizeColumnsToFit();
      });
  }

  onQuickFilterChanged(event) {
    console.log(event);
    this.gridApi.setQuickFilter(event.data.toLowerCase());
  }

  saveAll() {
    this.http
      .get(Constants.apiUrl + '/products')
      .subscribe((data: Product[]) => {
        this.rowDataOrg = JSON.parse(JSON.stringify(data));
        const savingRec = new Array();
        this.rowData.forEach(rec => {
          if (this.rowDataOrg.filter(a => a.id == rec.id).length > 0) {
            const org1 = this.rowDataOrg.filter(a => a.id == rec.id)[0];
            Object.keys(rec).forEach(key => {
              if (org1[key] !== rec[key]) {
                if (savingRec.filter(a => a.id == rec.id).length == 0) {
                  savingRec.push(rec);
                  return;
                }
              }
            });
          }
        });
        console.log('bulk save', savingRec);
        const headers = new HttpHeaders()
          .append('Content-Type', 'application/json');
        if (savingRec && savingRec.length > 0) {
          savingRec.forEach(element => {
            this.http.put(Constants.apiUrl + '/products/' + element.id, JSON.stringify(element), { headers: headers })
              .subscribe((data1: Product) => {
                console.log('product', data1);
                this.alertService.showMessage('Save', `Product '` + data1.ProductName + `' saved successfully`, MessageSeverity.success);
                // this.prod = data;
              });
          });
        } else {
          this.alertService.showMessage('Save', `Nothing to save!`, MessageSeverity.info);
        }
      });
  }
}

