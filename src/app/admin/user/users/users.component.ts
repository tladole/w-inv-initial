import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../../../shared/model/admin/user.model';
import { Constants } from '../../../shared/constants';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  columnDefs = [
    { headerName: 'Name', field: 'UserName' },
    { headerName: 'Active', field: 'Active' },
    { headerName: 'Last LoggedIn Date', field: 'LastLoggedIn' },
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

  public constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.rowSelection = "single";
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
    this.router.navigate(['/admin/users/details/', selectedRows[0].id])
    // document.querySelector("#selectedRows").innerHTML = selectedRowsString;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = new Array();
    let rows = new Array();

    this.http
      .get(Constants.apiUrl + '/users')
      .subscribe((data: any) => {
        data.forEach(element => {
          let data1 = data.filter(a => a.id == element.CreatedBy)[0];
          console.log('user', data1);
          let team = new User();
          team = element;
          team.CreatedBy = data1;
          rows.push(team);
        });
        this.rowData = data;
      });
  }

  onQuickFilterChanged(event) {
    console.log(event);
    this.gridApi.setQuickFilter(event.data);
  }

}
