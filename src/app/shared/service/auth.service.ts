import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../model/admin/user.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class AuthService {
public isUserLoggedIn: boolean;
public isUserAdmin: boolean;
missionChange: Subject<boolean> = new Subject();

  constructor(private http: HttpClient, private router: Router, private activeRoute: ActivatedRoute) { }

  isLoggedIn() {
    console.log(localStorage.getItem("loginSessId"))
    this.isUserLoggedIn = localStorage.getItem("loginSessId") ? true : false;
    return this.isUserLoggedIn;
  }

  logout(){
    localStorage.removeItem('loginSessId');
    this.isUserLoggedIn = false;
    this.router.navigate(['/login'])
  }

  emit(authenticated) {
    this.missionChange.next(authenticated);
  }
}
