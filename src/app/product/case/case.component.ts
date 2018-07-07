import { Component, OnInit } from '@angular/core';
import { Constants } from 'app/shared/constants';
import { ProductSet } from 'app/shared/model/product-set.model';
import { Router } from '@angular/router';
import { AlertService } from 'app/shared/service/alert.service';
import { HttpClient } from '@angular/common/http';
import { GridOptions, ColDef } from 'ag-grid';

@Component({
  selector: 'app-case',
  templateUrl: './case.component.html',
  styleUrls: ['./case.component.css']
})
export class CaseComponent implements OnInit {
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
    this.router.navigate(['products/cases/details/', selectedRows[0].id]);
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
}

