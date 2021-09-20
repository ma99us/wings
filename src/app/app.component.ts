import {Component} from '@angular/core';
import {Taster} from "./tasters/taster";
import {TastersService} from "./tasters/tasters.service";
import {ConfirmationDialog} from "./components/confirmation-dialog/confirmation-dialog";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {LoginDialog} from "./tasters/login/login-dialog.component";
import { noop } from 'rxjs';
import {AbstractTasterComponent} from "./components/abstract-components/abstract.taster.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent extends AbstractTasterComponent{
  title = 'wings';

  constructor(tastersService: TastersService, private modalService: NgbModal) {
    super(tastersService);
  }

  public login() {
    const modalRef = this.modalService.open(LoginDialog);
    modalRef.result
      .then(result => {
        if (result) {
          console.log('LoginDialog result', result);
        }
      })
      .catch(noop)
  }

  public logout() {
    this.tastersService.logout();
  }
}
