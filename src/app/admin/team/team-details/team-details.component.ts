import { Component, OnInit } from '@angular/core';
import { Team } from '../../../shared/model/admin/team.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../../shared/model/admin/user.model';
import { Constants } from '../../../shared/constants';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html'
})
export class TeamDetailsComponent implements OnInit {
  team: Team;
  orgProd: Team;
  teamId: number;
  users: User[];

  constructor(private http: HttpClient, private router: Router, private activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.team = new Team();
    this.activeRoute.params.subscribe((params: Params) => {
      console.log(params);
      this.teamId = params['id'];
      this.http
        .get(Constants.apiUrl + '/users')
        .subscribe((data: User[]) => {
          this.users = data;
          if (this.teamId) {
            this.http.get(Constants.apiUrl + '/teams/' + this.teamId)
              .subscribe((data1: Team) => {
                console.log('product', data1);
                this.team = data1;
                this.team.CreatedBy = data.filter(a => a.id == 1)[0];
                this.orgProd = Object.assign({}, this.team);
              });
          } else {
            console.log('product', data);
            this.users = data.filter(a => a.id != 1);
            this.team = new Team();
            this.team.id = -1;
            this.team.CreatedBy = data.filter(a => a.id == 1)[0];
          }
        });
    });
  }

  saveTeam() {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/json');
    let r: any = Object.assign({}, this.team);
    r.CreatedBy = this.team.CreatedBy.id;
    if (this.teamId) {
      this.http.put(Constants.apiUrl + '/teams/' + this.teamId, JSON.stringify(r), { headers: headers })
        .subscribe((data: Team) => {
          console.log('product', data);
          if (r.TeamLead) {
            let user = this.users.filter(a => a.id == r.TeamLead)[0];
            if (!user.Team || (user && user.Team.filter(a => a.TeamLead == r.TeamLead).length == 0)) {
              if (!user.Team)
                user.Team = new Array();
              user.Team.push(r.id);
              this.http.put(Constants.apiUrl + '/users/' + r.TeamLead, JSON.stringify(user), { headers: headers })
                .subscribe((data: Team) => {
                  console.log('product', data);
                  this.router.navigate(['/admin/teams']);
                  //this.prod = data;
                });
            }
          }
          this.router.navigate(['/admin/teams']);
          //this.prod = data;
        });
    } else {
      console.log(this.team);
      this.http
        .get(Constants.apiUrl + '/teams')
        .subscribe((data: Team[]) => {
          if (data.length > 0) {
            const id = Math.max.apply(Math, data.map(function (o) { return o.id; }));
            r.id = id ? id + 1 : 1;
          } else {
            r.id = 1;
          }
          r.CreatedDate = new Date(Date.now())
          console.log(r);
          this.http.post(Constants.apiUrl + '/teams', JSON.stringify(r), { headers: headers })
            .subscribe((data1: Team) => {
              console.log('product saved', data);
              if (r.TeamLead) {
                let user = this.users.filter(a => a.id == r.TeamLead)[0];
                if (!user.Team)
                  user.Team = new Array();
                user.Team.push(r.id);
                this.http.put(Constants.apiUrl + '/users/' + r.TeamLead, JSON.stringify(user), { headers: headers })
                  .subscribe((data: Team) => {
                    console.log('product', data);
                    this.router.navigate(['/admin/teams']);
                    //this.prod = data;
                  });
              }
              this.router.navigate(['/admin/teams']);
            });
        });
    }

  }

  cancelAll() {
    this.team = Object.assign({}, this.orgProd);
    console.log(this.team);
  }

  deleteTeam() {
    this.http.delete(Constants.apiUrl + '/teams/' + this.teamId)
      .subscribe((data: Team) => {
        console.log('product', data);
        this.router.navigate(['/admin/teams']);
        //this.prod = data;
      });

  }

}
