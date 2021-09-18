import {Component, Input, ViewEncapsulation} from '@angular/core';
import {NgbModal, NgbModalRef, NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'confirm-dialog',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{confirmationBoxTitle}}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Closed')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>{{confirmationMessage}}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-danger" (click)="activeModal.close(true)">{{yesButtonText}}</button>
      <button type="button" class="btn btn-secondary" (click)="activeModal.close(false)">{{noButtonText}}</button>
    </div>
  `,
  styles: [`
    .modal-footer {
    }

    .modal-footer.btn {
      margin-left: 1em;
    }
  `]
})
export class ConfirmationDialog {
  @Input() confirmationBoxTitle: string = 'Please Confirm!';
  @Input() confirmationMessage: string = 'Are you sure?';
  @Input() yesButtonText: string = 'Yes';
  @Input() noButtonText: string = 'No';

  constructor(public activeModal: NgbActiveModal) {
  }
}
