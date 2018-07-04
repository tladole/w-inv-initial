import { Component, OnInit } from '@angular/core';
import { UserRole } from '../../../shared/model/admin/user-role.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../../shared/model/admin/user.model';
import { Constants } from '../../../shared/constants';

@Component({
  selector: 'app-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.css']
})
export class RoleDetailsComponent implements OnInit {
  role: UserRole;
  orgProd: UserRole;
  roleId: number;

  constructor(private http: HttpClient, private router: Router, private activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.role = new UserRole();
    this.activeRoute.params.subscribe((params: Params) => {
      console.log(params);
      this.roleId = params['id'];
      if (this.roleId) {
        this.http.get(Constants.apiUrl + '/roles/' + this.roleId)
          .subscribe((data: any) => {
            console.log('user role', data);
            this.http.get(Constants.apiUrl + '/users/' + data.CreatedBy)
              .subscribe((data1: User) => {
                console.log('user', data1);
                this.role = new UserRole();
                this.role.id = this.roleId;
                this.role.RoleName = data.RoleName;
                this.role.CreatedDate = data.CreatedDate;
                this.role.CreatedBy = data1;
              });
            this.role = data;
            this.orgProd = Object.assign({}, this.role);
          });
      } else {
        this.http.get(Constants.apiUrl + '/users/' + 1)
          .subscribe((data: User) => {
            console.log('product', data);
            this.role = new UserRole();
            this.role.id = -1;
            this.role.CreatedBy = data;
          });
      }
    });
  }

  saveRole() {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');
    if (this.roleId) {
      let r: any = Object.assign({}, this.role);
      r.CreatedBy = this.role.CreatedBy.id;
      this.http.put(Constants.apiUrl + '/roles/' + this.roleId, JSON.stringify(r), { headers: headers })
        .subscribe((data: UserRole) => {
          console.log('product', data);
          this.router.navigate(['/admin/roles']);
          //this.prod = data;
        });
    } else {
      console.log(this.role);
      let r: any = Object.assign({}, this.role);
      r.CreatedBy = this.role.CreatedBy.id;
      this.http
        .get(Constants.apiUrl + '/roles')
        .subscribe((data: UserRole[]) => {
          if (data.length > 0) {
            const id = Math.max.apply(Math, data.map(function (o) { return o.id; }));
            r.id = id ? id + 1 : 1;
          } else {
            r.id = 1;
          }
          r.CreatedDate = new Date(Date.now())
          console.log(r);
          this.http.post(Constants.apiUrl + '/roles', JSON.stringify(r), { headers: headers })
            .subscribe((data1: UserRole) => {
              console.log('product saved', data);
              this.router.navigate(['/admin/roles']);
            });
        });
    }

  }
  cancelAll() {
    this.role = Object.assign({}, this.orgProd);
    console.log(this.role);
  }

  deleteRole() {
    this.http.delete(Constants.apiUrl + '/roles/' + this.roleId)
      .subscribe((data: UserRole) => {
        console.log('product', data);
        this.router.navigate(['/admin/roles']);
        //this.prod = data;
      });

  }

}
