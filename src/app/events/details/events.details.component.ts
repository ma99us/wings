import {Component, OnInit} from "@angular/core";
import * as moment from 'moment';
import {Event, EVENT_START_TIME} from "../event";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmDialogService} from "../../components/confirmation-dialog/confirmation-dialog.service";
import {EventsService} from "../events.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EventPlacePickerComponent} from "../place-picker/event.place-picker.component";
import {Place} from "../../places/place";
import {PlacesService} from "../../places/places.service";
import {Review} from "../../reviews/review";
import {ReviewsService} from "../../reviews/reviews.service";
import {AbstractTasterComponent} from "../../components/abstract-components/abstract.taster.component";
import {TastersService} from "../../tasters/tasters.service";
import {Taster} from "../../tasters/taster";
import {CalendarItem, EmbeddedFile, MailItem, MikeMailerService, Recipient} from "../../services/mike-mailer.service";
import {ImageLoaderService} from "../../services/image-loader.service";
import {HOST_BASE_URL} from "../../app-config";

@Component({
  selector: 'events-details',
  templateUrl: './events.details.component.html',
  styleUrls: ['./events.details.component.less']
})
export class EventsDetailsComponent extends AbstractTasterComponent implements OnInit {

  selectedEvent!: Event | null;
  submitted: boolean = false;
  eventPlace?: Place | null;
  eventReviews?: Review[] | null;
  reviewsTasters?: Taster[] | null;
  private eventsPlaces?: Event[] | null;
  private placesNames?: Place[] | null;
  mailSent: boolean = false;
  mailErr?: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private eventsService: EventsService,
              private placesService: PlacesService, private reviewsService: ReviewsService,
              private confirmation: ConfirmDialogService, private modalService: NgbModal,
              tasterService: TastersService, private mailerService: MikeMailerService, private imageLoader: ImageLoaderService) {
    super(tasterService);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id == 0) {
        this.makeNewEvent();
        if (this.selectedEvent) {
          this.selectedEvent.place_id = this.route.snapshot.queryParamMap.get('place_id');
        }
        this.getEventPlace();
        this.getEventReviews();
        this.getReviewTasters();
        this.getAllEventsPlaces();
        this.getAllPlacesNames();
      } else if (id) {
        this.eventsService.getEventById(id).subscribe((data: Event) => {
          this.selectedEvent = data;
          this.getEventPlace();
          this.getEventReviews();
          this.getReviewTasters();
          this.getAllEventsPlaces();
          this.getAllPlacesNames();
        }, err => {
          this.selectedEvent = null;
          this.eventPlace = null;
          this.eventReviews = null;
          this.reviewsTasters = null;
          this.eventsPlaces = null;
          this.placesNames = null;
        });
      }
    });
  }

  goBack() {
    const url: string = "/events";
    this.router.navigateByUrl(url);
  }

  makeNewEvent() {
    this.selectedEvent = new Event();
    this.selectedEvent.time = EVENT_START_TIME;   // by default
    // this.selectedEvent.title = "New Event";
    // this.selectedEvent.date = new Date();
  }

  getEventPlace() {
    if (this.selectedEvent && this.selectedEvent.place_id) {
      this.placesService.getPlaceById(this.selectedEvent.place_id).subscribe((data: Place) => {
        this.eventPlace = data;
        if (this.selectedEvent && this.eventPlace) {
          this.selectedEvent.title = this.eventPlace.title;
        }
      }, err => {
        this.eventPlace = null;
      });
    } else {
      this.eventPlace = null;
      // if (this.selectedEvent) {
      //   this.selectedEvent.title = "-nowhere-";
      // }
    }
  }

  get eventPlaceName() {
    return this.eventPlace ? this.eventPlace.title : (this.selectedEvent && this.selectedEvent.place_id ? ('Place id: ' + this.selectedEvent.place_id) : 'Select a Place');
  }

  getEventReviews() {
    if (this.selectedEvent && this.selectedEvent.place_id) {
      this.reviewsService.getReviews(0, -1, "event_id,author_id,comment,review_rating,images")
        .subscribe((data: Review[]) => {
          this.eventReviews = data.filter(review => this.selectedEvent && review.event_id == this.selectedEvent.id);  // FIXME: '==' is intentional!
        }, err => {
          this.eventReviews = null;
        });
    } else {
      this.eventReviews = null;
    }
  }

  getReviewTasters() {
    this.tastersService.getTasters(0, -1, "name,email,notifyEvents")
      .subscribe((tasters: Taster[]) => {
        this.reviewsTasters = tasters;
      }, (err) => {
        this.reviewsTasters = null;
      });
  }

  getAllEventsPlaces() {
    this.eventsService.getEventsPlaces()
      .subscribe((events: Event[]) => {
        this.eventsPlaces = events;
      }, err => {
        this.eventsPlaces = null;
      });
  }

  getAllPlacesNames() {
    this.placesService.getPlacesNames()
      .subscribe((places: Place[]) => {
        this.placesNames = places;
      }, err => {
        this.placesNames = null;
      });
  }

  onSubmit(): void {
    if (!this.selectedEvent) {
      return;
    }

    this.eventsService.addUpdateEvent(this.selectedEvent)
      .subscribe((data: Event) => {
        this.selectedEvent = data;
        this.submitted = true;
        // this.goBack();
        this.notify();
      });
  }

  deleteEvent(): void {
    if (!this.selectedEvent || !this.selectedEvent.id) {
      return;
    }

    this.confirmation.openConfirmation("Are you sure?", "Do you want to delete \"" + this.selectedEvent.title + "\" Event?")
      .then(result => {
        if (result && this.selectedEvent && this.selectedEvent.id) {
          this.eventsService.deleteEvent(this.selectedEvent)
            .subscribe((data: Event) => {
              this.deleteEventReviews();
            });
        }
      });
  }

  deleteEventReviews() {
    //TODO: delete all reviews with event_id of deleted event

    this.submitted = true;
    this.goBack();
  }

  pickPlacePopup() {
    const modalRef = this.modalService.open(EventPlacePickerComponent);
    modalRef.componentInstance.selectedEvent = this.selectedEvent;
    modalRef.result.then(result => {
      if (result && this.selectedEvent) {
        this.getEventPlace();
      }
    });
  }

  onEventPlaceClick() {
    if (!this.selectedEvent || !this.selectedEvent.place_id) {
      return;
    }
    const url: string = "/places/" + this.selectedEvent.place_id;
    this.router.navigateByUrl(url);
  }

  newReview() {
    if (!this.selectedEvent || !this.selectedEvent.id) {
      return;
    }
    let existingReview: Review | undefined = undefined;
    if (this.currentTaster && this.eventReviews) {
      existingReview = this.eventReviews.find(review => this.currentTaster && review.author_id == this.currentTaster.id); // FIXME: '==' is intentional!
    }
    if (existingReview) {
      this.confirmation.openConfirmation("You already reviewed this event", "Do you want to edit your review?")
        .then(result => {
          if (result && existingReview) {
            const url: string = "/reviews/" + existingReview.id;
            this.router.navigateByUrl(url);
          }
        });
    } else {
      const url: string = "/reviews/0?event_id=" + this.selectedEvent.id;
      this.router.navigateByUrl(url);
    }
  }

  onSelectReview = (review: Review): void => {
    const url: string = "/reviews/" + review.id;
    this.router.navigateByUrl(url);
  };

  getTasterForReview = (review: Review) => {
    return (this.reviewsTasters && review) ? this.reviewsTasters.find(taster => {
      return review.author_id == taster.id;   // FIXME: '==' is intentional!
    }) : null;
  };

  suggestEventDate(): string | null {
    if (!this.eventsPlaces) {
      return null;  // can not suggest anything atm.
    }

    // find a event for each month in the future starting from this month
    let maxMonth = 0;
    let t = undefined;
    let oldEvent = undefined;
    do {
      if (!t) {
        t = moment();
      } else {
        t.add(1, 'months');
        maxMonth++;
      }
      oldEvent = this.findEventForMonth(t);
    } while (oldEvent && maxMonth < 6);

    if (oldEvent || !t) {
      return null;  // can not suggest anything fro the next 6 month
    }

    // if we found a month without an events, find a first Friday in it
    t.startOf('month');
    const isoFriday = 5;
    if (t.isoWeekday() > isoFriday) {
      t.isoWeekday(7 + isoFriday);
    } else {
      t.isoWeekday(isoFriday);
    }
    const friday = t.format('YYYY-MM-DD');
    if (this.selectedEvent) {
      this.selectedEvent.date = friday;
    }
    return friday;
  }

  private findEventForMonth(t: moment.Moment): Event | undefined {
    if (!this.eventsPlaces) {
      return undefined;
    }
    return this.eventsPlaces.find((event: Event) => {
      const eventDate = event.eventDate;
      return eventDate?.getFullYear() === t.year() && eventDate?.getMonth() === t.month();
    });
  }

  suggestEventPlace(): Place | undefined {
    if(!this.placesNames){
      return undefined;
    }
    // find first Place in natural order, which does nto have an event yet
    const place = this.placesNames.find((place) => {
      return !(this.eventsPlaces ? this.eventsPlaces.find((evt) => evt.place_id == place.id) : undefined);  // FIXME: '==' is intentional!
    });
    if (place && this.selectedEvent) {
      this.selectedEvent.place_id = place.id;
      this.getEventPlace();
    }
    return place;
  }

  private notify() {
    if (!this.selectedEvent?.notifications) {
      this.sendNewEventMessage();
    } else {
      this.confirmation.openConfirmation("Notifications?", "Do you also want to re-send this Event notifications?")
        .then(result => {
          if (result) {
            this.sendNewEventMessage();
          }
        });
    }
  }

  /**
   * Send out email schedule notifications
   */
  private sendNewEventMessage() {
    if (!this.selectedEvent || !this.reviewsTasters || !this.selectedEvent.eventDate || !this.selectedEvent.place_id) {
      //throw 'Event has to be defined, have the Date and Location set';
      return;
    }

    this.mailSent = false;
    this.mailErr = undefined;

    const mailItem = new MailItem();
    mailItem.replyTo = new Recipient(this.currentTasterName, this.currentTaster?.email);

    this.reviewsTasters.forEach(taster => {
      if (taster.notifyEvents) {
        mailItem.addCc(new Recipient(taster?.name, taster?.email));
      }
    });
//    mailItem.addTo(new Recipient(this.currentTaster?.name, this.currentTaster?.email)); //// #TEST

    mailItem.subject='New Wings Event';
    mailItem.plainText = `${this.currentTasterName} scheduled a new Wings Event for ${this.selectedEvent.eventDateTimeStr}, at ${this.eventPlaceName}`;
    const eventUrl = this.selectedEvent?.id ? (HOST_BASE_URL + "/events/" + this.selectedEvent?.id) : null;

    // populate Calendar portion
    let startDate = this.selectedEvent.startDateTimeJsonString;
    let endDate = this.selectedEvent.endDateTimeJsonString;
    mailItem.calendarItem = new CalendarItem(startDate!, endDate!, this.selectedEvent.eventFullTitleStr);
    mailItem.calendarItem.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.reviewsTasters.forEach(taster => {
      mailItem.calendarItem!.addAttendee(new Recipient(taster?.name, taster?.email));
    });
    mailItem.calendarItem.description = "Se you all there!";
    mailItem.calendarItem.url = eventUrl ? eventUrl : undefined;
    mailItem.calendarItem.organizer = new Recipient(this.currentTasterName, this.currentTaster?.email);
    mailItem.calendarItem.location = this.eventPlaceName;

    // populate rich html portion
    mailItem.htmlText = `<p>
        <b>${this.currentTasterName}</b> scheduled a new
        <a href="${eventUrl}" target="_blank">
          <img style='vertical-align:middle' height='60px' src='cid:event'>
          Wings Event
        </a>
        for <b><i>${this.selectedEvent.eventDateTimeStr}</i></b>, at <b><i>${this.eventPlaceName}</i></b>
      </p>`;
    this.imageLoader.loadImageToDataUrl('./assets/event.png')
      .then((data) => {
        const chunks = data.split(/[:;,]/);
        if (chunks.length != 4 || chunks[0] != 'data' || chunks[2] != 'base64') {
          throw `Unexpected image data url; parsed length=${chunks.length}, \'data\'==${chunks[0]}, \'base64\'==${chunks[2]}`;
        }
        const type = chunks[1]; // "image/png"
        const b64encoded = chunks[3];
        mailItem.addEmbeddedImage(new EmbeddedFile("event", b64encoded, type));
        this.sendMailItem(mailItem);
      })
      .catch((err) => {
        this.mailSent = true;
        this.mailErr = "Error loading image";
      });
  }

  private sendMailItem(mailItem: MailItem){
    this.mailerService.sendMail(mailItem).subscribe((success) => {
      this.mailSent = true;
      this.mailErr = null;
      if(this.selectedEvent){
        this.selectedEvent.notifications = !this.selectedEvent.notifications ? 1 : this.selectedEvent.notifications + 1;
        this.eventsService.addUpdateEvent(this.selectedEvent)
          .subscribe((data: Event) => {
            this.selectedEvent = data;
            this.submitted = true;
            // this.goBack();
          });
      }
    }, (err) => {
      this.mailSent = true;
      this.mailErr = "Error sending e-mail";
    });
  }
}
