import {Injectable} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ConfirmationDialog} from "./confirmation-dialog";

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  constructor(private modalService: NgbModal) {
  }

  openConfirmation(title = 'Confirmation.', message = 'Are you sure?') : Promise<any> {
    const modalRef = this.modalService.open(ConfirmationDialog);
    modalRef.componentInstance.confirmationBoxTitle = title;
    modalRef.componentInstance.confirmationMessage = message;

    return modalRef.result;
  }
}
