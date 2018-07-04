import { Component, OnInit } from '@angular/core';
import { User } from '../../../shared/model/admin/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Team } from '../../../shared/model/admin/team.model';
import { UserRole } from '../../../shared/model/admin/user-role.model';
import { Constants } from '../../../shared/constants';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user: User;
  orgProd: User;
  UserId: number;
  userPassword: string;
  teams: Team[];
  roles: UserRole[];
  users: User[];

  constructor(private http: HttpClient, private router: Router, private activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.http
      .get(Constants.apiUrl + '/teams')
      .subscribe((data: Team[]) => {
        console.log(data)
        this.teams = data;
      });
    this.http
      .get(Constants.apiUrl + '/roles')
      .subscribe((data: UserRole[]) => {
        console.log(data)
        this.roles = data;
      });
    //this.user = new User();
    this.activeRoute.params.subscribe((params: Params) => {
      console.log(params);
      const id = params['id'];
      this.http
        .get(Constants.apiUrl + '/users')
        .subscribe((u: User[]) => {
          this.users = u;
          if (id) {
            this.http.get(Constants.apiUrl + '/users/' + id)
              .subscribe((data: any) => {
                let data1 = u.filter(a => a.id == data.CreatedBy)[0];
                console.log('product', data);
                this.user = data;
                this.UserId = id;
                this.user.CreatedBy = data1;
                this.orgProd = Object.assign({}, this.user);
              });
          } else {
            this.http.get(Constants.apiUrl + '/users/' + 1)
              .subscribe((data: User) => {
                console.log('product', data);
                this.user = new User();
                this.user.id = -1;
                this.user.CreatedBy = data;
              });
          }
        });
    });
  }

  saveUser() {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');
      let r: any = Object.assign({}, this.user);
      r.CreatedBy = this.user.CreatedBy.id;
    if (this.UserId) {
      this.http.put(Constants.apiUrl + '/Users/' + this.UserId, JSON.stringify(r), { headers: headers })
        .subscribe((data: User) => {
          console.log('product', data);
          this.router.navigate(['/admin/users']);
          //this.prod = data;
        });
    } else {
      console.log(r);
      this.http
        .get(Constants.apiUrl + '/Users')
        .subscribe((data: User[]) => {
          if (data.length > 0) {
            const id = Math.max.apply(Math, data.map(function (o) { return o.id; }));
            r.id = id ? id + 1 : 1;
          } else {
            r.id = 1;
          }
          r.CreatedDate = new Date(Date.now())
          console.log(r);
          this.http.post(Constants.apiUrl + '/Users', JSON.stringify(r), { headers: headers })
            .subscribe((data1: User) => {
              console.log('product saved', data1);
              this.http.post(Constants.apiUrl + '/password', JSON.stringify({ id: r.id, Password: this.userPassword }), { headers: headers })
                .subscribe((data1: User) => {
                  console.log('product saved', data1);
                  this.router.navigate(['/admin/users']);
                });
            });
        });
    }

  }
  cancelAll() {
    this.user = Object.assign({}, this.orgProd);
    console.log(this.user);
  }

  deleteUser() {
    this.http.delete(Constants.apiUrl + '/Users/' + this.UserId)
      .subscribe((data: User) => {
        console.log('product', data);
        this.http.delete(Constants.apiUrl + '/password/' + this.UserId)
          .subscribe((data1: User) => {
            console.log('product saved', data1);
            this.router.navigate(['/admin/users']);
          });
        //this.prod = data;
      });

  }

}
