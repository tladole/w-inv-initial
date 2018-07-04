import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Constants } from '../../shared/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { DropdownField } from '../../shared/model/dropdown-key.model';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.css']
})
export class ProductCategoryComponent implements OnInit {
  catagoryId: number;
  category: DropdownField[];
  categoryOrg: DropdownField[];
  private gridApi;
  private gridColumnApi;
  columnDefs = [
    { headerName: 'Product Name', field: 'Name', editable: true }
  ]

  constructor(private http: HttpClient, public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.category = new Array();

    this.http
      .get(Constants.apiUrl + '/category')
      .subscribe((data: DropdownField[]) => {
        console.log('in category', data)
        this.category = data;
        this.categoryOrg = JSON.parse(JSON.stringify(this.category));
      });
  }

  addRow() {
    let cat = new DropdownField();
    cat.id = '-1';
    cat.Name = '';
    this.category.push({ id: '-1', Name: '' });
    this.gridApi.setRowData(this.category)
    this.gridApi.redrawRows();
    console.log('Category', this.category);
  }

  deleteCategory() {
    var selectedRows = this.gridApi.getSelectedRows();
    selectedRows.forEach(selectedRow => {
      this.http.delete(Constants.apiUrl + '/Category/' + selectedRow.id)
        .subscribe((data: DropdownField) => {
          console.log('Category', data);
          //this.prod = data;
        });
    });
    this.bsModalRef.hide();
  }

  saveCategory() {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');
    this.gridApi.stopEditing(false);
    // let a: Observable[] = new Array();
    this.category.forEach(element => {
      let catId = this.categoryOrg.filter(a => a.id == element.id && a.Name != element.Name && element.Name != '');
      if (catId.length > 0) {
        this.http.put(Constants.apiUrl + '/Category/' + element.id, JSON.stringify(element), { headers: headers })
          .subscribe((data: DropdownField) => {
            console.log('Category', data);
            //this.prod = data;
          });
      } else if (element.id == '-1') {
        console.log(element);
        this.http
          .get(Constants.apiUrl + '/category')
          .subscribe((data: DropdownField[]) => {
            element.id = Math.max.apply(Math, data.map(function (o) { return o.id; }));
            element.id = element.id + 2;
            console.log(element);
            this.http.post(Constants.apiUrl + '/Category', JSON.stringify(element), { headers: headers })
              .subscribe((data1: DropdownField) => {
                console.log('Category saved', data);
              });
          });
      }
    });
    this.bsModalRef.hide();
  }
}
