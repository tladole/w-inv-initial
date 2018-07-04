import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import {
  AlertService,
  MessageSeverity,
  DialogType
} from '../shared/service/alert.service';
import { AuthService } from '../shared/service/auth.service';
import { ConfigurationService } from '../shared/service/configuration.service';
import { UserLogin } from '../shared/model/user-login.model';
import { Utilities } from '../shared/service/utilities';
import { User } from '../shared/model/admin/user.model';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Constants } from '../shared/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  userLogin = new UserLogin();
  isLoading = false;
  formResetToggle = true;
  modalClosedCallback: () => void;
  loginStatusSubscription: any;

  @Input() isModal = false;
  returnUrl: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private alertService: AlertService,
    private authService: AuthService,
    private configurations: ConfigurationService
  ) { }

  ngOnInit() {
    this.returnUrl = this.activeRoute.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnDestroy() { }

  getShouldRedirect() {
    return (
      !this.isModal
    );
  }

  showErrorAlert(caption: string, message: string) {
    this.alertService.showMessage(caption, message, MessageSeverity.error);
  }

  closeModal() {
    if (this.modalClosedCallback) {
      this.modalClosedCallback();
    }
  }

  login() {
    this.authService.isUserLoggedIn = false;
    this.isLoading = true;
    this.alertService.startLoadingMessage('', 'Attempting login...');
    console.log(this.userLogin)
    this.http.get(Constants.apiUrl + '/users')
      .subscribe((data: User[]) => {
        let selectedUsers = data.filter(a => a.UserName.trim().toLowerCase() == this.userLogin.email.trim().toLowerCase());
        console.log('login', selectedUsers)
        if (selectedUsers.length > 0) {
          this.http.get(Constants.apiUrl + '/password/' + selectedUsers[0].id)
            .subscribe((data1: any) => {
              console.log('login pass', data1)
              if (data1.Password == this.userLogin.password) {
                localStorage.setItem('loginSessId', JSON.stringify(selectedUsers[0]));
                this.alertService.showMessage('Login Successful', this.userLogin.email + ' is now active.', MessageSeverity.success);
                this.authService.isUserLoggedIn = true;
                if (selectedUsers[0].id == 1)
                  this.authService.isUserAdmin = true;
                else
                  this.authService.isUserAdmin = false;
                this.router.navigate([this.returnUrl])
              } else {
                this.alertService.showMessage('Login Failed', 'Username or userpassword not marched.', MessageSeverity.error);
              }
              this.alertService.stopLoadingMessage();
              this.isLoading = false;
            });
        }
      });
  }

  offerAlternateHost() {
    if (
      Utilities.checkIsLocalHost(location.origin)
    ) {
      this.alertService.showDialog(
        'Dear Developer!\nIt appears your backend Web API service is not running...\n' +
        'Would you want to temporarily switch to the online Demo API below?(Or specify another)',
        DialogType.prompt,
        (value: string) => {
          this.alertService.showStickyMessage(
            'API Changed!',
            'The target Web API has been changed to: ' + value,
            MessageSeverity.warn
          );
        },
        null,
        null,
        null,
        ''
      );
    }
  }

  reset() {
    this.formResetToggle = false;

    setTimeout(() => {
      this.formResetToggle = true;
    });
  }
}
