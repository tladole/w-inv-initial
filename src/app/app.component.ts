import { Component, ViewEncapsulation, OnInit, AfterViewInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import {
    ToastyService,
    ToastyConfig,
    ToastOptions,
    ToastData
} from 'ng2-toasty';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthService } from './shared/service/auth.service';
import { AlertService, AlertDialog, DialogType, AlertMessage, MessageSeverity } from './shared/service/alert.service';
import { Constants } from './shared/constants';
import { HttpClient } from '@angular/common/http';
import { Mission } from './shared/model/mission.model';
var alertify: any = require('./assets/scripts/alertify.js');

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, AfterViewInit {
    title = 'WOGO';
    appLogo = require('./assets/images/WOGO-logo.png');
    stickyToasties: number[] = [];
    missionName: Mission;

    constructor(
        public router: Router,
        public authService: AuthService,
        public toastyService: ToastyService,
        public toastyConfig: ToastyConfig,
        private alertService: AlertService,
        private http: HttpClient
    ) {
        this.toastyConfig.theme = 'bootstrap';
        this.toastyConfig.position = 'top-right';
        this.toastyConfig.limit = 100;
        this.toastyConfig.showClose = true;
    }

    ngOnInit() {
        setTimeout(() => {
            if (this.authService.isUserLoggedIn) {
                this.alertService.resetStickyMessage();

                //if (!this.authService.isSessionExpired)
                this.alertService.showMessage("Login", `Welcome back!`, MessageSeverity.default);
                //else
                //    this.alertService.showStickyMessage("Session Expired", "Your Session has expired. Please log in again", MessageSeverity.warn);
            }
        }, 2000);

        this.alertService.getDialogEvent().subscribe(alert => this.showDialog(alert));
        this.alertService.getMessageEvent().subscribe(message => this.showToast(message, false));
        this.alertService.getStickyMessageEvent().subscribe(message => this.showToast(message, true));

        this.http
            .get(Constants.apiUrl + '/mission')
            .subscribe((data: any) => {
                let data1 = data.filter(a => a.active == true);
                if (data1 && data1.length > 0) {
                    Constants.missionName = data1[0];
                    this.missionName = Constants.missionName;
                }
            });

        this.authService.missionChange.subscribe(data => {
            if (data)
                this.missionName = Constants.missionName;
        });
    }

    ngAfterViewInit(): void {
    }

    logout() {
        this.authService.logout();
    }


    showDialog(dialog: AlertDialog) {

        alertify.set({
            labels: {
                ok: dialog.okLabel || "OK",
                cancel: dialog.cancelLabel || "Cancel"
            }
        });

        switch (dialog.type) {
            case DialogType.alert:
                alertify.alert(dialog.message);

                break
            case DialogType.confirm:
                alertify
                    .confirm(dialog.message, (e) => {
                        if (e) {
                            dialog.okCallback();
                        }
                        else {
                            if (dialog.cancelCallback)
                                dialog.cancelCallback();
                        }
                    });

                break;
            case DialogType.prompt:
                alertify
                    .prompt(dialog.message, (e, val) => {
                        if (e) {
                            dialog.okCallback(val);
                        }
                        else {
                            if (dialog.cancelCallback)
                                dialog.cancelCallback();
                        }
                    }, dialog.defaultValue);

                break;
        }
    }





    showToast(message: AlertMessage, isSticky: boolean) {

        if (message == null) {
            for (let id of this.stickyToasties.slice(0)) {
                this.toastyService.clear(id);
            }

            return;
        }

        let toastOptions: ToastOptions = {
            title: message.summary,
            msg: message.detail,
            timeout: isSticky ? 0 : 4000
        };


        if (isSticky) {
            toastOptions.onAdd = (toast: ToastData) => this.stickyToasties.push(toast.id);

            toastOptions.onRemove = (toast: ToastData) => {
                let index = this.stickyToasties.indexOf(toast.id, 0);

                if (index > -1) {
                    this.stickyToasties.splice(index, 1);
                }

                toast.onAdd = null;
                toast.onRemove = null;
            };
        }


        switch (message.severity) {
            case MessageSeverity.default: this.toastyService.default(toastOptions); break
            case MessageSeverity.info: this.toastyService.info(toastOptions); break;
            case MessageSeverity.success: this.toastyService.success(toastOptions); break;
            case MessageSeverity.error: this.toastyService.error(toastOptions); break
            case MessageSeverity.warn: this.toastyService.warning(toastOptions); break;
            case MessageSeverity.wait: this.toastyService.wait(toastOptions); break;
        }
    }


}
