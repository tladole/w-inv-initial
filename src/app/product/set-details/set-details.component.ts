import { Component, OnInit } from '@angular/core';
import { ProductSet } from 'app/shared/model/product-set.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Constants } from 'app/shared/constants';
import { Product } from 'app/shared/model/product.model';
import { ColDef } from 'ag-grid';
import { AgDropdownGenEditorComponent } from 'app/shared/component/ag-dropdown-gen-editor/ag-dropdown-gen-editor.component';

@Component({
  selector: 'app-set-details',
  templateUrl: './set-details.component.html',
  styleUrls: ['./set-details.component.css']
})
export class SetDetailsComponent implements OnInit {
  productsetInv: any[];
  rowDataOrg: any;
  rowData: any[];
  prod: ProductSet;
  orgProd: ProductSet;
  prodId: number;
  unitofpacking: any;
  category: any;
  productset: any;
  country: any;

  private gridApi;
  private gridColumnApi;
  private invGridApi;
  private invGridColumnApi;

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

  constructor(private http: HttpClient, private router: Router,
    public activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
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
    this.prod = new ProductSet();
    this.activeRoute.params.subscribe((params: Params) => {
      console.log(params);
      this.prodId = params['id'];
      if (this.prodId) {
        this.http.get(Constants.apiUrl + '/productset/' + this.prodId)
          .subscribe((data: ProductSet) => {
            console.log('product recieved', data);
            this.prod = data;
            this.orgProd = Object.assign({}, this.prod);
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
    });
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
    this.productsetInv = new Array();

    this.http
      .get(Constants.apiUrl + '/productset/' + 1)
      .subscribe((data: ProductSet) => {
        this.productsetInv = data.ProductsUnits;
        this.gridApi.sizeColumnsToFit();
      });
  }


  saveProduct() {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');
    if (this.prodId) {
      this.http.put(Constants.apiUrl + '/products/' + this.prodId, JSON.stringify(this.prod), { headers: headers })
        .subscribe((data: Product) => {
          console.log('product', data);
          this.router.navigate(['/products/list']);
          // this.prod = data;
        });
    } else {
      console.log(this.prod);
      this.http
        .get(Constants.apiUrl + '/products')
        .subscribe((data: Product[]) => {
          this.prod.id = Math.max.apply(Math, data.map(function (o) { return o.id; }));
          this.prod.id = this.prod.id + 2;
          console.log(this.prod);
          this.http.post(Constants.apiUrl + '/products', JSON.stringify(this.prod), { headers: headers })
            .subscribe((data1: Product) => {
              console.log('product saved', data);
              this.router.navigate(['/products/list']);
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
      .subscribe((data: Product) => {
        console.log('product', data);
        this.router.navigate(['/products/list']);
      });

  }

}
