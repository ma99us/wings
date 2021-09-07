import {Component, Input, ViewEncapsulation} from '@angular/core';
import {NgbModal, NgbModalRef, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirmation-dialog.html',
})
export class ConfirmationDialog {
  @Input() confirmationBoxTitle:string = 'Confirm';
  @Input() confirmationMessage:string = 'Are you sure?';

  constructor(public activeModal: NgbActiveModal) {}
}
