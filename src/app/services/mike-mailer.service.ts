import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent} from '@angular/common/http';
import {Observable} from "rxjs/internal/Observable";
import {MAILER_API_KEY, MAILER_URL} from "../app-config";

@Injectable({
  providedIn: 'root'
})
export class MikeMailerService {

  constructor(private http: HttpClient) {
  }

  /**
   * Populates http headers for any mike-mailer API http request
   * @param value
   * @returns {any}
   */
  private prepareHeaders<Type>(value: Type): any {
    const headers: any = {
      'API_KEY': MAILER_API_KEY,    // always send api key with every request header
      'Content-Type': 'application/json;charset=utf-8'
    };
    return headers;
  }

  /**
   * Gets backend service staus
   */
  getStatus() {
    return this.http.get(MAILER_URL, {
      headers: this.prepareHeaders(null)
    })
  }

  sendMail(value: MailItem) {
    return this.http.post(MAILER_URL, value, {
      headers: this.prepareHeaders(value)
    });
  }


  // sendMail(value: MailItem): Observable<HttpEvent<any>> {
  //   return this.http.post<FormData>(MAILER_URL, value, {
  //     headers: this.prepareHeaders(value),
  //     reportProgress: true,
  //     observe: 'events'
  //   });
  // }
}

// Email classes
export class MailItem {
  from?: Recipient;
  tos?: Recipient[];
  ccs?: Recipient[];
  bccs?: Recipient[];
  replyTo?: Recipient;
  subject?: string;
  htmlText?: string;
  plainText?: string;
  embeddedImages?: EmbeddedFile[];
  attachments?: EmbeddedFile[];
  headers?: Header[];
  returnReceiptTo?: boolean;
  dispositionNotificationTo?: string;
  bounceTo?: string;
  calendarItem?: CalendarItem;

  addTo(recipient: Recipient) {
    if (!this.tos) {
      this.tos = [];
    }
    this.tos.push(recipient);
  }

  addCc(recipient: Recipient) {
    if (!this.ccs) {
      this.ccs = [];
    }
    this.ccs.push(recipient);
  }

  addBcc(recipient: Recipient) {
    if (!this.bccs) {
      this.bccs = [];
    }
    this.bccs.push(recipient);
  }

  addEmbeddedImage(file: EmbeddedFile) {
    if (!this.embeddedImages) {
      this.embeddedImages = [];
    }
    this.embeddedImages.push(file);
  }

  addAttachment(file: EmbeddedFile) {
    if (!this.attachments) {
      this.attachments = [];
    }
    this.attachments.push(file);
  }

  addHeader(header: Header) {
    if (!this.headers) {
      this.headers = [];
    }
    this.headers.push(header);
  }
}

export class Recipient {
  name?: string;
  email?: string;

  constructor(name?: string, email?: string) {
    this.name = name;
    this.email = email;
  }

  get fullName() {
    let fullName = this.name;
    if (this.email) {
      fullName += " <" + this.email + ">";
    }
    return fullName;
  }
}

export class EmbeddedFile {
  name: string;
  data?: Uint8Array;
  dataBase64?: string;
  type: string;

  constructor(name: string, data: Uint8Array | string, type: string) {
    this.name = name;
    if (data instanceof Uint8Array) {
      this.data = data;
    } else if (typeof data == 'string') {
      this.dataBase64 = data;
    }
    this.type = type;
  }
}

export class Header {
  name: string;
  value: any;

  constructor(name: string, value: any) {
    this.name = name;
    this.value = value;
  }
}

export class CalendarItem {
  name: string;
  description?: string;
  url?: string;
  organizer?: Attendee;
  location?: string;
  timeZone?: string;
  startTime: Date;
  endTime: Date;
  attendees?: Attendee[];

  constructor(startTime: Date, endTime: Date, name: string) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.name = name;
  }

  addAttendee(attendee: Attendee) {
    if (!this.attendees) {
      this.attendees = [];
    }
    this.attendees.push(attendee);
  }
}

export class Attendee extends Recipient {
  required?: boolean;

  constructor(name?: string, email?: string, required: boolean = false) {
    super(name, email);
    this.required = required;
  }
}
