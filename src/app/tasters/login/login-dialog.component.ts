import {Component, Directive, ElementRef, Input, OnInit, ViewChild} from "@angular/core";
import {Taster} from "../taster";
import {ActivatedRoute, Router} from "@angular/router";
import {TastersService} from "../tasters.service";
import {first} from "rxjs/operators";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.less'],
})
export class LoginDialog implements OnInit {
  @ViewChild('usernameCtrl', {static: true}) usernameCtrl!: ElementRef;
  @ViewChild('passwordCtrl', {static: true}) passwordCtrl!: ElementRef;
  @Input() usernameStr?: string;
  passwordStr?: string;
  fixedUsername: boolean = false;
  loading = false;
  submitted = false;
  loggedIn?: Taster;

  constructor(public activeModal: NgbActiveModal, private route: ActivatedRoute, private router: Router, private tastersService: TastersService) {
  }

  ngOnInit() {
    this.fixedUsername = this.usernameStr !== undefined
    // console.log(this.elem);
    if (this.fixedUsername) {
      this.passwordCtrl.nativeElement.focus();
    } else {
      this.usernameCtrl.nativeElement.focus();
    }
  }

  onSubmit() {
    if (!this.usernameStr || !this.passwordStr) {
      return;
    }
    this.loggedIn = undefined;
    this.loading = true;
    this.tastersService.login(this.usernameStr, this.passwordStr)
      .pipe(first())
      .subscribe({
        next: (taster?: Taster) => {
          this.loggedIn = taster;
          // get return url from query parameters or default to home page
          // const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          // this.router.navigateByUrl(returnUrl);
          this.submitted = true;
          this.loading = false;
          if (this.loggedIn) {
            this.activeModal.close(this.loggedIn);
          }
        },
        error: error => {
          // this.alertService.error(error);
          this.submitted = true;
          this.loading = false;
          this.loggedIn = undefined;
        }
      });
  }
}
