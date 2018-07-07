import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserRole } from '../../../shared/model/admin/user-role.model';
import { User } from '../../../shared/model/admin/user.model';
import { Constants } from '../../../shared/constants';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html'
})
export class RolesComponent implements OnInit {

  columnDefs = [
    { headerName: 'Name', field: 'RoleName' },
    { headerName: 'Created By', field: 'CreatedBy.UserName' },
    {
      headerName: 'Created Date', field: 'CreatedDate',
      valueFormatter: data => {
        const d = new Date(data.value);
        const day = d.getDate().toString()[1] ? d.getDate().toString() : '0' + d.getDate().toString();
        const month = (d.getMonth() + 1).toString()[1] ? (d.getMonth() + 1).toString() : '0' + (d.getMonth() + 1).toString();
        return (new Date(data.value)).getFullYear() + '-' + month + '-' + day;
      }
    }
  ];

  private gridApi;
  private gridColumnApi;
  rowData: any;
  public rowSelection;
  public users: any;

  public constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.rowSelection = 'single';
    this.http.get(Constants.apiUrl + '/users')
      .subscribe((data1: any) => {
        console.log('users', data1);
        this.users = data1;
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
    this.router.navigate(['admin/roles/details/', selectedRows[0].id])
    // document.querySelector("#selectedRows").innerHTML = selectedRowsString;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = new Array();
    const rows = new Array();

    this.http
      .get(Constants.apiUrl + '/roles')
      .subscribe((data: any) => {
        data.forEach(element => {
          const data1 = this.users.filter(a => a.id == element.CreatedBy)[0];
          console.log('user', data1);
          const role = new UserRole();
          role.id = element.id;
          role.RoleName = element.RoleName;
          role.CreatedDate = element.CreatedDate;
          role.CreatedBy = data1;
          rows.push(role);
        });
        this.rowData = rows;
      });
  }

  onQuickFilterChanged(event) {
    console.log(event);
    this.gridApi.setQuickFilter(event.data);
  }

}
