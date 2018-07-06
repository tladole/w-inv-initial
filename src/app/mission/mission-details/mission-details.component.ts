import { Component, OnInit } from '@angular/core';
import { MissionView, Mission } from '../../shared/model/mission.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Constants } from '../../shared/constants';
import { User } from '../../shared/model/admin/user.model';

@Component({
  selector: 'app-mission-details',
  templateUrl: './mission-details.component.html'
})
export class MissionDetailsComponent implements OnInit {
  role: MissionView;
  orgProd: MissionView;
  roleId: number;

  constructor(private http: HttpClient, private router: Router, private activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.role = new MissionView();
    this.activeRoute.params.subscribe((params: Params) => {
      console.log(params);
      this.roleId = params['id'];
      if (this.roleId) {
        this.http.get(Constants.apiUrl + '/mission/' + this.roleId)
          .subscribe((data: any) => {
            console.log('user role', data);
            this.http.get(Constants.apiUrl + '/users/' + data.modifiedBy)
              .subscribe((data1: User) => {
                console.log('user', data1);
                this.role = new MissionView();
                this.role.id = this.roleId;
                this.role.name = data.name;
                this.role.location = data.location;
                this.role.modifiedDate = data.modifiedDate;
                this.role.modifiedBy = data1;
              });
            this.role = data;
            this.orgProd = Object.assign({}, this.role);
          });
      } else {
        this.http.get(Constants.apiUrl + '/users/' + 1)
          .subscribe((data: User) => {
            console.log('product', data);
            this.role = new MissionView();
            this.role.id = -1;
            this.role.modifiedBy = data;
            this.role.modifiedDate = new Date(Date.now());
          });
      }
    });
  }

  saveRole() {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');
    if (this.roleId) {
      const r: any = Object.assign({}, this.role);
      r.modifiedBy = this.role.modifiedBy.id;
      this.http.put(Constants.apiUrl + '/mission/' + this.roleId, JSON.stringify(r), { headers: headers })
        .subscribe((data: MissionView) => {
          console.log('product', data);
          this.router.navigate(['/admin/mission']);
          // this.prod = data;
        });
    } else {
      console.log(this.role);
      const r: any = Object.assign({}, this.role);
      r.modifiedBy = this.role.modifiedBy.id;
      this.http
        .get(Constants.apiUrl + '/mission')
        .subscribe((data: Mission[]) => {
          if (data.length > 0) {
            const id = Math.max.apply(Math, data.map(function (o) { return o.id; }));
            r.id = id ? id + 1 : 1;
          } else {
            r.id = 1;
          }
          r.CreatedDate = new Date(Date.now());
          console.log(r);
          this.http.post(Constants.apiUrl + '/mission', JSON.stringify(r), { headers: headers })
            .subscribe((data1: Mission) => {
              console.log('product saved', data);
              this.router.navigate(['/admin/mission']);
            });
        });
    }

  }
  cancelAll() {
    this.role = Object.assign({}, this.orgProd);
    console.log(this.role);
  }

  deleteRole() {
    this.http.delete(Constants.apiUrl + '/mission/' + this.roleId)
      .subscribe((data: Mission) => {
        console.log('product', data);
        this.router.navigate(['/admin/mission']);
        // this.prod = data;
      });

  }

}
