import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Team } from '../../../shared/model/admin/team.model';
import { Constants } from '../../../shared/constants';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  columnDefs = [
    { headerName: 'Name', field: 'TeamName' },
    { headerName: 'Team Lead', field: 'TeamLead.UserName' },
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
  private users: any;

  public constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.rowSelection = "single";
    this.http.get(Constants.apiUrl + '/users')
      .subscribe((data1: any) => {
        console.log('users', data1);
        this.users = data1;
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
    this.router.navigate(['/admin/teams/details/', selectedRows[0].id])
    // document.querySelector("#selectedRows").innerHTML = selectedRowsString;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = new Array();
    let rows = new Array();

    this.http
      .get(Constants.apiUrl + '/teams')
      .subscribe((data: any) => {
        console.log("row teams",data)
        data.forEach(element => {
          let data1 = this.users.filter(a => a.id == element.CreatedBy)[0];
          console.log('user', data1);
          let team = new Team();
          team.id = element.id;
          team.TeamName = element.TeamName;
          if (element.TeamLead) {
            let data2 = this.users.filter(a => a.id == element.TeamLead)[0];
            team.TeamLead = data2;
          }
          team.CreatedDate = element.CreatedDate;
          team.CreatedBy = data1;
          rows.push(team);
        });
        console.log("teams",rows)
        this.rowData = rows;
      });
  }

  onQuickFilterChanged(event) {
    console.log(event);
    this.gridApi.setQuickFilter(event.data);
  }

}
