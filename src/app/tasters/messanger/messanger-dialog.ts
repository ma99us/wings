import {Component, ElementRef, Injectable, Input, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Taster} from "../taster";
import {EmbeddedFile, MailItem, MikeMailerService, Recipient} from "../../services/mike-mailer.service";
import {ImageLoaderService} from "../../services/image-loader.service";
import {HOST_BASE_URL} from "../../app-config";

@Component({
  selector: 'messenger-dialog',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{titleTxt}}</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Closed')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <div class="modal-title block" *ngIf="from">
        <h6 >{{fromTxt}}</h6>
      </div>
      <form #messengerForm="ngForm">
        <textarea id="text" name="text" [(ngModel)]="msg.text" placeholder="Say something..."
                  #text="ngModel" required
                  rows="4" cols="54" #textarea autofocus
        >
        </textarea>
      </form>
    </div>
    <div class="modal-footer">
      <div>
        <img
          *ngIf="sending"
          width="30"
          height="30"
          alt="Loading..."
          src="./assets/loading-buffering.gif"
        />
      </div>
      <button type="button" class="btn btn-primary" [attr.disabled]="(!msg.text || sending) ? '' : null" (click)="sendMessage()">Send</button>
      <button type="button" class="btn btn-secondary" [attr.disabled]="sending ? '' : null" (click)="activeModal.close(false)">Close</button>
    </div>
    <div class="note">
      <span *ngIf="sent && !err" class="alert-success">
        Message sent.
      </span>
      <span *ngIf="sent && err" class="alert-danger">
        Error: {{err}}.
      </span>
    </div>
  `,
  styles: [`
    .block {
      display: inline-block;
      width:100%;
    }

    .note{
      margin-left: 1em;
    }

    .modal-body {
      padding-top: 5px;
    }

    .modal-footer {
    }

    .modal-footer.btn {
      margin-left: 1em;
    }
  `]
})
export class MessengerDialog implements OnInit {
  @ViewChild('textarea', {static: true}) textareaCtrl!: ElementRef;
  @Input() to?: Taster;
  @Input() from?: Taster;
  @Input() title: string = 'Send a message';
  @Input() message?: string;
  msg = {
    text: this.message
  };
  sent: boolean = false;
  err?: string | null = undefined;

  constructor(public activeModal: NgbActiveModal, private mailerService: MikeMailerService, private imageLoader: ImageLoaderService) {
  }

  ngOnInit(): void {
    if (this.textareaCtrl) {
      this.textareaCtrl.nativeElement.focus();
    }
  }

  get titleTxt() {
    let titleTxt = this.title;
    if (this.to) {
      titleTxt += ' to ' + this.to.name;
    }
    return titleTxt;
  }

  get fromTxt() {
    return 'From ' + (this.from ? this.from.name : 'Anonymous') + ": ";
  }

  get fromUrl(): string | null {
    return this.from?.id ? (HOST_BASE_URL + "/tasters/" + this.from?.id) : null;
  }

  get sending(){
    return this.sent === false && this.err === null;
  }

  sendMessage() {
    if (!this.msg.text) {
      return;
    }

    if(!this.to || !this.to.email){
      throw 'Message recipient has to be specified and have an e-mail';
    }

    this.sent = false;
    this.err = null;

    const mailItem = new MailItem();
    mailItem.from = new Recipient(this.from?.name, this.from?.email);
    mailItem.addTo(new Recipient(this.to?.name, this.to?.email));
    mailItem.subject='Wings Taster Message';
    mailItem.plainText = this.fromTxt + this.msg.text;
    // this.sendMailItem(mailItem); // #TEST

    // populate rich html portion
    mailItem.htmlText = `<p>
      <a href="${this.fromUrl}" target="_blank">
        <img style='vertical-align:middle' height='60px' src='cid:from'>
        <i> ${this.fromTxt}</i>
      </a>
      <b>${this.msg.text}</b></p>`;
    //TODO: maybe try html with some embedded image
    this.imageLoader.loadImageToDataUrl(this.from?.photo || './assets/tasters_logo_200.png')
      .then((data) => {
        const chunks = data.split(/[:;,]/);
        if (chunks.length != 4 || chunks[0] != 'data' || chunks[2] != 'base64') {
          throw `Unexpected image data url; parsed length=${chunks.length}, \'data\'==${chunks[0]}, \'base64\'==${chunks[2]}`;
        }
        const type = chunks[1]; // "image/png"
        const b64encoded = chunks[3];
        mailItem.addEmbeddedImage(new EmbeddedFile("from", b64encoded, type));
        this.sendMailItem(mailItem);
      })
      .catch((err) => {
        this.sent = true;
        this.err = "Error uploading image";
      });
  }

  private sendMailItem(mailItem: MailItem){
    this.mailerService.sendMail(mailItem).subscribe((success) => {
      this.sent = true;
      this.err = null;
      // this.activeModal.close(true);
    }, (err) => {
      this.sent = true;
      this.err = "Error sending e-mail";
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class MessengerDialogService {

  constructor(private modalService: NgbModal) {
  }

  openMessengerDialog(to: Taster, from?: Taster, title: string = 'Send a message', message?: string): Promise<any> {
    const modalRef = this.modalService.open(MessengerDialog);
    modalRef.componentInstance.to = to;
    modalRef.componentInstance.from = from;
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;

    return modalRef.result;
  }
}
