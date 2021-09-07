import {Component, Input, ViewEncapsulation} from '@angular/core';
import {NgbModal, NgbModalRef, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirmation-dialog.html',
  styleUrls: ['./confirmation-dialog.less']
})
export class ConfirmationDialog {
  @Input() confirmationBoxTitle: string = 'Please Confirm!';
  @Input() confirmationMessage: string = 'Are you sure?';
  @Input() yesButtonText: string = 'Yes';
  @Input() noButtonText: string = 'No';

  constructor(public activeModal: NgbActiveModal) {
  }
}
