import { Component, OnInit } from '@angular/core';
import { Constants } from '../../shared/constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { DropdownField } from '../../shared/model/dropdown-key.model';
import { MessageSeverity, AlertService } from 'app/shared/service/alert.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html'
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

  constructor(private http: HttpClient,
    private alertService: AlertService
  ) { }

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

  onQuickFilterChanged(event) { }

  addRow() {
    const cat = new DropdownField();
    cat.id = '-1';
    cat.Name = '';
    this.category.push({ id: '-1', Name: '' });
    this.gridApi.setRowData(this.category)
    this.gridApi.redrawRows();
    console.log('Category', this.category);
  }

  deleteCategory() {
    const selectedRows = this.gridApi.getSelectedRows();
    selectedRows.forEach(selectedRow => {
      this.http.delete(Constants.apiUrl + '/Category/' + selectedRow.id)
        .subscribe((data: DropdownField) => {
          console.log('Category', data);
          this.alertService.showMessage('Delete', `Category '` + selectedRow.Name + `' deleted successfully.`, MessageSeverity.success);
          this.http
            .get(Constants.apiUrl + '/category')
            .subscribe((data1: DropdownField[]) => {
              console.log('in category', data1)
              this.category = data1;
              this.categoryOrg = JSON.parse(JSON.stringify(this.category));
            });
        });
    });
  }

  saveCategory() {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');
    this.gridApi.stopEditing(false);
    // let a: Observable[] = new Array();
    this.category.forEach(element => {
      const catId = this.categoryOrg.filter(a => a.id == element.id && a.Name != element.Name && element.Name != '');
      if (catId.length > 0) {
        this.http.put(Constants.apiUrl + '/Category/' + element.id, JSON.stringify(element), { headers: headers })
          .subscribe((data: DropdownField) => {
            console.log('Category', data);
            this.alertService.showMessage('Delete', `Category '` + data.Name + `' updated successfully.`, MessageSeverity.success);
            // this.prod = data;
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
                this.alertService.showMessage('Delete', `Category '` + data1.Name + `' added successfully.`, MessageSeverity.success);
                console.log('Category saved', data);
              });
          });
      }
    });
  }
}
