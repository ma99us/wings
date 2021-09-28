import {Component, Injectable, Input} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'image-viewer-dialog',
  template: `
    <!--<div class="modal-header">-->
    <!--<button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Closed')">-->
    <!--<span aria-hidden="true">&times;</span>-->
    <!--</button>-->
    <!--</div>-->
    <div class="modal-body" [class.loading]="!loaded">
      <img
        *ngIf="!loaded"
        width="60"
        height="60"
        alt="Loading..."
        src="./assets/loading-buffering.gif"
      />
      <img
        [hidden]="!loaded" 
        (load)="loaded = true"
        [src]="src"
        (click)="activeModal.dismiss('Image click')"
      />
    </div>
    <div class="modal-footer" *ngIf="title">
      <h3>{{title}}</h3>
    </div>
  `,
  styles: [`
    .modal-header,
    .modal-footer,
    .modal-body {
      text-align: center;
      color: #c2c3c4;
      background-color: #505050;
      border-color: #444444;
    }

    h3 {
      text-align: center;
    }

    img {
      max-width: 100%;
      max-height: 100%;
      cursor: pointer;
    }
    
    .loading {
//      background-image: url("assets/loading-buffering.gif");
    }
  `]
})
export class ImageViewerDialog {
  @Input() src!: string;
  @Input() title?: string;
  loaded: boolean = false;

  constructor(public activeModal: NgbActiveModal) {
  }
}

@Component({
  selector: 'image-viewer',
  template: `
    <img
      [attr.width]="width ? width : null"
      [attr.height]="height ? height : null"
      [src]="src"
      [attr.alt]="title ? title : null"
      (click)="viewImage()"
    >
  `,
  styles: [`
    img {
      cursor: pointer;
      margin: 1em;
    }
  `]
})
export class ImageComponent {
  @Input() src!: string;
  @Input() title?: string;
  @Input() width?: string;
  @Input() height?: string;

  constructor(private modalService: NgbModal) {
  }

  viewImage() {
    const modalRef = this.modalService.open(ImageViewerDialog, {
      size: 'xl', keyboard: false, centered: true,
      modalDialogClass: 'modal-dialog-port'
    });
    modalRef.componentInstance.src = this.src;
    modalRef.componentInstance.title = this.title;

    return modalRef.result;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ImageViewerService {

  constructor(private modalService: NgbModal) {
  }

  public viewImage(src: string, title: string | undefined = undefined): Promise<any> {
    const modalRef = this.modalService.open(ImageViewerDialog, {size: 'xl', keyboard: false, centered: true});
    modalRef.componentInstance.src = src;
    modalRef.componentInstance.title = title;

    return modalRef.result;
  }
}
