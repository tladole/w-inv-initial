import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  AlertService,
  MessageSeverity,
  DialogType
} from '../../shared/service/alert.service';
import { Router } from '@angular/router';
import { Product } from '../../shared/model/product.model';
import { Constants } from '../../shared/constants';
import { ColDef, GridOptions } from 'ag-grid';
import { AgDropdownGenEditorComponent } from '../../shared/component/ag-dropdown-gen-editor/ag-dropdown-gen-editor.component';
import { AgDateGenEditorComponent } from '../../shared/component/ag-date-gen-editor/ag-date-gen-editor.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {
  gridOptions: GridOptions = {
    context: { curr: this }
  }
  columnDefs: ColDef[] = [
    { headerName: 'Product Name', field: 'ProductName', editable: true, pinned: true, width: 300 },
    {
      headerName: 'Category', field: 'CategoryId', editable: true, width: 150,
      cellEditorFramework: AgDropdownGenEditorComponent,
      cellEditorParams: params => {
        return { values: this.category }; // .map(u => u.Name)
      },
      valueFormatter: data => {
        const d = this.category.filter(a => a.id == data.value)[0];
        return d.Name;
      },
      valueParser: params => {
        return this.category.filter(a => a.Name == params.newValue)[0].id;
      },
      getQuickFilterText: params => {
        const d = this.category.filter(a => a.id == params.value)[0];
        return d.Name.toLowerCase();
      }
    },
    {
      headerName: 'Unit Of Packaging', field: 'UnitOfPackagingId', editable: true,
      cellEditorFramework: AgDropdownGenEditorComponent,
      cellEditorParams: params => {
        return { values: this.unitofpacking }; // .map(u => u.Name)
      },
      valueParser: params => {
        return this.unitofpacking.filter(a => a.Name == params.newValue)[0].id;
      },
      valueFormatter: data => {
        const d = this.unitofpacking.filter(a => a.id == data.value)[0];
        return d.Name;
      },
      getQuickFilterText: params => {
        const d = this.unitofpacking.filter(a => a.id == params.value)[0];
        return d.Name.toLowerCase();
      }
    },
    { headerName: 'Units Per Packaging', editable: true, field: 'UnitsPerPackage', width: 250 },
    { headerName: 'Value Per Package', editable: true, field: 'ValuePerPackage' },
    { headerName: 'Expiration Date', editable: true, field: 'ExpirationDate', cellEditorFramework: AgDateGenEditorComponent },
    { headerName: 'Manufacturer', editable: true, field: 'Manufacturer' },
    { headerName: 'Product Code', editable: true, field: 'ProductCode' },
    { headerName: 'Product Lot', editable: true, field: 'Lot' },
    {
      headerName: 'Country Of Origin', editable: true, field: 'CountryOfOriginId',
      cellEditorFramework: AgDropdownGenEditorComponent,
      cellEditorParams: params => {
        return { values: this.country }; // .map(u => u.Name)
      },
      valueParser: params => {
        return this.country.filter(a => a.Name == params.newValue)[0].id;
      },
      valueFormatter: data => {
        const d = this.country.filter(a => a.id == data.value)[0];
        return d.Name;
      },
      getQuickFilterText: params => {
        const d = this.country.filter(a => a.id == params.value)[0];
        return d.Name.toLowerCase();
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
    this.http
      .get(Constants.apiUrl + '/country')
      .subscribe((data: any) => {
        console.log(data)
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
    this.router.navigate(['products/details/', selectedRows[0].id])
  }

  updateOther() {
    const selectedRows = this.gridApi.getSelectedRows();
    console.log(selectedRows);
    this.router.navigate(['products/details/', selectedRows[0].id])
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = new Array();

    this.http
      .get(Constants.apiUrl + '/products')
      .subscribe((data: Product[]) => {
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
        console.log('bulk save', savingRec)
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

