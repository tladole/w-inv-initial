import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Constants } from '../../shared/constants';
import { Mission, MissionView } from '../../shared/model/mission.model';
import { ColDef } from 'ag-grid';
import {
  AlertService,
  MessageSeverity,
  DialogType
} from '../../shared/service/alert.service';
import { AuthService } from '../../shared/service/auth.service';

@Component({
  selector: 'app-missions',
  templateUrl: './missions.component.html',
  styleUrls: ['./missions.component.css']
})
export class MissionsComponent implements OnInit {
  columnDefs: ColDef[] = [
    { headerName: 'Name', field: 'name', editable: true },
    { headerName: 'Location', field: 'location', editable: true },
    { headerName: 'Created By', field: 'modifiedBy.UserName' },
    {
      headerName: 'Modified Date', field: 'modifiedDate',
      valueFormatter: data => {
        const d = new Date(data.value);
        console.log('day', data.value, d, d.getDate(), d.getDate().toString()[1])
        const day = d.getDate().toString()[1] ? d.getDate().toString() : '0' + d.getDate().toString();
        const month = (d.getMonth() + 1).toString()[1] ? (d.getMonth() + 1).toString() : '0' + (d.getMonth() + 1).toString();
        return (new Date(data.value)).getFullYear() + '-' + month + '-' + day;
      }
    },
    {
      headerName: "Actions",
      suppressMenu: true,
      suppressSorting: true,
      template:
        `
        <a href="javascript:void(0);" class="btn-xs btn-link" data-action-type="update" role="button">Make Active</a>
        `
    }
  ];

  private gridApi;
  private gridColumnApi;
  rowData: any;
  public rowSelection;
  public users: any;

  public constructor(private http: HttpClient,
    private alertService: AlertService,
    public authService: AuthService,
    private router: Router) {
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
    // var selectedRows = this.gridApi.getSelectedRows();
    // var selectedRowsString = "";
    // console.log(selectedRows);
    // selectedRows.forEach(function (selectedRow, index) {
    //   if (index !== 0) {
    //     selectedRowsString += ", ";
    //   }
    //   selectedRowsString += selectedRow.model;
    // });
    // this.router.navigate(['admin/mission/details/', selectedRows[0].id])
  }

  public onRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e.data;
      let actionType = e.event.target.getAttribute("data-action-type");

      switch (actionType) {
        case "update":
          return this.onActionViewClick(data);
      }
    }
  }

  public onActionViewClick(data2: any) {
    console.log("View action clicked", data2);
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');
    data2.active = true;

    this.http.put(Constants.apiUrl + '/mission/' + data2.id, JSON.stringify(data2), { headers: headers })
      .subscribe((data: Mission) => {
        console.log('product', data);
        this.alertService.showMessage('Save', `Mission '` + data.name + `' updated successfully.`, MessageSeverity.success);
        Constants.missionName = data;
        this.authService.emit(true);
        //this.prod = data;
        this.http
          .get(Constants.apiUrl + '/mission')
          .subscribe((data1: Mission[]) => {
            data1.forEach(element => {
              if (element.id != data2.id) {
                element.active = false;
                this.http.put(Constants.apiUrl + '/mission/' + element.id, JSON.stringify(element), { headers: headers })
                  .subscribe((data3: Mission) => {
                    console.log('product', data3);
                    this.alertService.showMessage('Save', `Mission '` + data3.name + `' updated successfully.`, MessageSeverity.success);
                    //this.prod = data;
                  });
              }
            });
          });
      });
  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = new Array();
    let rows = new Array();

    this.http
      .get(Constants.apiUrl + '/mission')
      .subscribe((data: Mission[]) => {
        data.forEach(element => {
          let data1 = this.users.filter(a => a.id == element.modifiedBy)[0];
          console.log('user', data1);
          let role = new MissionView();
          role.id = element.id;
          role.name = element.name;
          role.location = element.location;
          role.modifiedDate = element.modifiedDate;
          role.modifiedBy = data1;
          rows.push(role);
        });
        this.rowData = rows;
      });
  }

  onQuickFilterChanged(event) {
    console.log(event);
    this.gridApi.setQuickFilter(event.data);
  }

  saveAll() {
    this.http
      .get(Constants.apiUrl + '/mission')
      .subscribe((data: Mission[]) => {
        let rowDataOrg = JSON.parse(JSON.stringify(data));
        let savingRec = new Array();
        console.log('start save all', this.rowData, data)
        this.rowData.forEach(rec => {
          if (rowDataOrg.filter(a => a.id == rec.id).length > 0) {
            const org1 = rowDataOrg.filter(a => a.id == rec.id)[0];
            const recDetail = new Mission(rec.id, rec.name, rec.location, rec.modifiedBy.id, rec.modifiedDate);
            Object.keys(rec).forEach(key => {
              if (org1[key] != recDetail[key]) {
                if (savingRec.filter(a => a.id == rec.id).length == 0) {
                  savingRec.push(recDetail);
                  return;
                }
              }
            });
          }
        });
        console.log("bulk save", savingRec)
        const headers = new HttpHeaders()
          .append('Content-Type', 'application/json');
        savingRec.forEach(element => {
          this.http.put(Constants.apiUrl + '/mission/' + element.id, JSON.stringify(element), { headers: headers })
            .subscribe((data: Mission) => {
              console.log('product', data);
              this.alertService.showMessage('Save', `Mission '` + data.name + `' updated successfully.`, MessageSeverity.success);
              //this.prod = data;
            });
        });
      });
  }
}
