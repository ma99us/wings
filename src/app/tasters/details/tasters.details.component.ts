import {Component, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Taster} from "../taster";
import {ConfirmDialogService} from "../../components/confirmation-dialog/confirmation-dialog.service";
import {TastersService} from "../tasters.service";
import {NgForm} from "@angular/forms";
import {AbstractTasterComponent} from "../../components/abstract-components/abstract.taster.component";

@Component({
  selector: 'tasters-details',
  templateUrl: './tasters.details.component.html',
  styleUrls: ['./tasters.details.component.less']
})
export class TastersDetailsComponent extends AbstractTasterComponent implements OnInit {

  @ViewChild('tasterForm', {static: true}) form!: NgForm;
  selectedTaster!: Taster | null;
  submitted = false;
  passwordNew?: string;
  passwordCopy?: string;

  constructor(private route: ActivatedRoute, private router: Router, tastersService: TastersService,
              private confirmation: ConfirmDialogService) {
    super(tastersService);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id == 0) {
        this.selectedTaster = new Taster();
      } else if (id) {
        this.tastersService.getTasterById(id).subscribe((data: Taster) => {
          this.selectedTaster = data;
        }, err => {
          this.selectedTaster = null;
        });
      }
    });
  }

  goBack() {
    const url: string = "/tasters";
    this.router.navigateByUrl(url);
  }

  onSubmit(): void {
    if (!this.selectedTaster) {
      return;
    }
    this.hashNewPassword();
    this.tastersService.addUpdateTaster(this.selectedTaster)
      .subscribe((data: Taster) => {
        this.selectedTaster = data;
        this.submitted = true;
        // this.goBack();
      });
  }

  deleteTaster(): void {
    if (!this.selectedTaster || !this.selectedTaster.id) {
      return;
    }

    this.confirmation.openConfirmation("Are you sure?", "Do you want to delete \"" + this.selectedTaster.name + "\" Taster?")
      .then(result => {
        if (result && this.selectedTaster && this.selectedTaster.id) {
          this.tastersService.deleteTaster(this.selectedTaster)
            .subscribe((data: Taster) => {
              this.submitted = true;
              this.goBack();
            });
        }
      });
  }

  checkPasswords(){
    if (this.passwordNew && this.passwordNew !== this.passwordCopy) {
      // console.log('passwords do not match');
      // setTimeout(() => this.form.controls['password_copy'].setErrors({'nomatch': true}) );   // setErrors() must be called after change detection runs?
      this.form.controls['password_copy'].setErrors({'nomatch': true});
    } else {
      // console.log('passwords match or no new password');
      // to clear the error, we don't have to wait
      this.form.controls['password_copy'].setErrors(null);
    }
  }

  hashNewPassword() {
    if (this.selectedTaster && this.passwordNew && this.passwordCopy && this.passwordNew === this.passwordCopy) {
      const passDigest = this.tastersService.digestPassword(this.passwordNew);
      // console.log('new passwords digest: "' + passDigest + '"');
      this.selectedTaster.password = passDigest;
    }
  }
}
