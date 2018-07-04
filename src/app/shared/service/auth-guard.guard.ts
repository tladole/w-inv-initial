import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardGuard implements CanActivate, CanActivateChild {
  constructor(private authService: AuthService, private router: Router) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isLoggedIn()) {
      let user = JSON.parse(localStorage.getItem('loginSessId'));
      if (user.id == 1) this.authService.isUserAdmin = true;
      return true;
    }
    this.authService.isUserLoggedIn = false;
    this.authService.isUserAdmin = false;
    // not logged in so redirect to login page with the return url and return false
    this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.authService.isLoggedIn()) { 
      if (!this.authService.isUserAdmin && state.url.indexOf('/admin/') > 0)
        this.router.navigate(['/']);
      return true;
    }
    this.authService.isUserLoggedIn = false;
    this.authService.isUserAdmin = false;
    // not logged in so redirect to login page with the return url and return false
    this.router.navigate(['login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
