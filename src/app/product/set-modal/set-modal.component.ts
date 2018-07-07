import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { AgDropdownGenEditorComponent } from 'app/shared/component/ag-dropdown-gen-editor/ag-dropdown-gen-editor.component';
import { AgDateGenEditorComponent } from 'app/shared/component/ag-date-gen-editor/ag-date-gen-editor.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  AlertService,
  MessageSeverity
} from 'app/shared/service/alert.service';
import { Router } from '@angular/router';
import { Constants } from 'app/shared/constants';
import { Product } from 'app/shared/model/product.model';
import { ProductSet, ProductsUnits } from '../../shared/model/product-set.model';

@Component({
  selector: 'app-set-modal',
  templateUrl: './set-modal.component.html',
  styleUrls: ['./set-modal.component.css']
})
export class SetModalComponent implements OnInit {
  products: any;
  productset: any;
  prodId: any;
  private gridApi;
  private gridColumnApi;
  private invGridApi;
  private invGridColumnApi;
  rowData: any;
  rowDataOrg: any;
  public rowSelection;
  public invRowSelection;
  unitofpacking: any;
  category: any;
  prod: ProductSet;

  columnDefs: ColDef[] = [
    {
      headerName: 'Product Name',
      field: 'ProductName',
      editable: true,
      pinned: true,
      width: 300
    },
    {
      headerName: 'Category',
      field: 'CategoryId',
      editable: true,
      width: 150,
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
      headerName: 'Unit Of Packaging',
      field: 'UnitOfPackagingId',
      editable: true,
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
    }
  ];

  invColumnDefs: ColDef[] = [
    {
      headerName: 'Product Name',
      field: 'ProductName',
      editable: true,
      pinned: true,
      width: 300
    },
    {
      headerName: 'Category',
      field: 'CategoryId',
      editable: true,
      width: 150,
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
      headerName: 'Unit Of Packaging',
      field: 'UnitOfPackagingId',
      editable: true,
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
    { headerName: 'Total Packages Needed', field: 'TotalPackagesNeeded' }
  ];

  public constructor(
    private http: HttpClient,
    private alertService: AlertService,
    private router: Router,
    public bsModalRef: BsModalRef,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.http
      .get(Constants.apiUrl + '/unitofpacking')
      .subscribe((data: any) => {
        console.log(data);
        this.unitofpacking = data;
      });
    this.http.get(Constants.apiUrl + '/category').subscribe((data: any) => {
      console.log(data);
      this.category = data;
    });
    this.http.get(Constants.apiUrl + '/products').subscribe((data: any) => {
      console.log(data);
      this.products = data;
    });
    this.prod = new ProductSet();
    const aa = this.modalService.config;

    this.prodId = (this.modalService.config.initialState as any).prodId;
    if (this.prodId) {
      this.http.get(Constants.apiUrl + '/products/' + this.prodId)
        .subscribe((data: ProductSet) => {
          console.log('product recieved', data);
          this.prod = data;
          this.http
            .get(Constants.apiUrl + '/productset')
            .subscribe((data1: any) => {
              console.log('productset', data1);
              this.productset = data1.filter(a => a.productId == this.prod.id);
            });
        });
    } else {
      this.prod = new ProductSet();
    }
  }

  onProdGridReady(params) {
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
  onInvGridReady(params) {
    this.invGridApi = params.api;
    this.invGridColumnApi = params.columnApi;
    this.rowData = new Array();

    this.http
      .get(Constants.apiUrl + '/products')
      .subscribe((data: Product[]) => {
        this.rowData = data;
        this.rowDataOrg = JSON.parse(JSON.stringify(data));
        this.gridApi.sizeColumnsToFit();
      });
  }

  moveToSet() {
    if (!this.prod.ProductsUnits) {
      this.prod.ProductsUnits = new Array();
    }
    const selectedRows = this.gridApi.getSelectedRows();
    console.log(selectedRows);
    selectedRows.forEach(function (selectedRow, index) {
      const prodU = new ProductsUnits();
      prodU.product = selectedRow;
      this.prod.ProductsUnits.push(prodU)
    });
  }

  moveOutOfSet() {

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
        const headers = new HttpHeaders().append(
          'Content-Type',
          'application/json'
        );
        if (savingRec && savingRec.length > 0) {
          savingRec.forEach(element => {
            this.http
              .put(
              Constants.apiUrl + '/products/' + element.id,
              JSON.stringify(element),
              { headers: headers }
              )
              .subscribe((data1: Product) => {
                console.log('product', data1);
                this.alertService.showMessage(
                  'Save',
                  `Product '` + data1.ProductName + `' saved successfully`,
                  MessageSeverity.success
                );
                // this.prod = data;
              });
          });
        } else {
          this.alertService.showMessage(
            'Save',
            `Nothing to save!`,
            MessageSeverity.info
          );
        }
      });
  }
}
