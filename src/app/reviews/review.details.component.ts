import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {DecimalPipe} from "@angular/common";
import {Event} from "../events/event";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmDialogService} from "../components/confirmation-dialog/confirmation-dialog.service";
import {EventsService} from "../events/events.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Review} from "./review";
import {ReviewsService} from "./reviews.service";
import {Form, NgForm} from "@angular/forms";
import {animate, keyframes, style, transition, trigger} from "@angular/animations";
import {AbstractTasterComponent} from "../components/abstract-components/abstract.taster.component";
import {TastersService} from "../tasters/tasters.service";
import {Taster} from "../tasters/taster";
import {Observable} from "rxjs/internal/Observable";
import {CalendarItem, EmbeddedFile, MailItem, MikeMailerService, Recipient} from "../services/mike-mailer.service";
import {ImageLoaderService} from "../services/image-loader.service";
import {HOST_BASE_URL} from "../app-config";

export const glow = trigger('fadeInOut', [
  transition('* => *', [
    style({textShadow: '0 0 0 #fff, 0 0 0 #fff, 0 0 0 #fff, 0 0 0 #fff, 0 0 0 #fff, 0 0 0 #fff, 0 0 0 #fff'}),
    animate(250, style({textShadow: '0 0 20px #fff, 0 0 30px #fff, 0 0 40px #fff, 0 0 50px #fff, 0 0 60px #fff, 0 0 70px #fff, 0 0 80px #fff'})),
    animate(250, style({textShadow: '0 0 0 #fff, 0 0 0 #fff, 0 0 0 #fff, 0 0 0 #fff, 0 0 0 #fff, 0 0 0 #fff, 0 0 0 #fff'})),
  ]) // when the item is changed    // FIXME: that does not work! even if add [@glow]="review.review_rating" to the template element
]);

@Component({
  selector: 'review-details',
  templateUrl: './review.details.component.html',
  styleUrls: ['./review.details.component.less'],
  animations: [glow]
})
export class ReviewDetailsComponent extends AbstractTasterComponent implements OnInit, OnDestroy {

  @ViewChild('reviewForm', {static: true}) form!: NgForm;
  formChangesSubscription: any;
  review!: Review | null;
  submitted: boolean = false;
  reviewEvent!: Event | null;
  reviewTaster!: Taster | null;
  reviewsTasters?: Taster[] | null;
  mailSent: boolean = false;
  mailErr?: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private reviewsService: ReviewsService,
              private eventsService: EventsService, private confirmation: ConfirmDialogService, private modalService: NgbModal,
              tasterService: TastersService, private mailerService: MikeMailerService, private imageLoader: ImageLoaderService,
              private decimalPipe: DecimalPipe) {
    super(tasterService);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id == 0) {
        this.makeNewReview();
        if (this.review) {
          this.review.event_id = Number(this.route.snapshot.queryParamMap.get('event_id'));
        }
        this.getReviewTaster();
        this.getReviewEvent();
        this.getReviewTasters();
      } else if (id) {
        this.reviewsService.getReviewById(id).subscribe((data: Review) => {
          this.review = data;
          this.getReviewTaster();
          this.getReviewEvent();
          this.getReviewTasters();
        }, err => {
          this.review = null;
        });
      }
    });

    this.formChangesSubscription = this.form.form.valueChanges.subscribe(x => {
      // console.log('values', x);
      this.updateReviewRating();
    })
  }

  ngOnDestroy() {
    this.formChangesSubscription.unsubscribe();
  }

  get reviewRatingText() {
    if (this.review?.review_rating == null || this.review?.review_rating == undefined) {
      return 'n/a';
    }
    return this.decimalPipe.transform(this.review.review_rating, '1.2-2');
  }

  goBack() {
    const url: string = "/events/" + (this.reviewEvent ? this.reviewEvent.id : '');
    this.router.navigateByUrl(url);
  }

  makeNewReview() {
    this.review = new Review();
    if (this.currentTaster) {
      this.review.author_id = this.currentTaster.id;
    }
    // this.review.date = new Date();
  }

  onSubmit(): void {
    if (!this.review) {
      return;
    }
    this.reviewsService.addUpdateReview(this.review)
      .subscribe((data: Review) => {
        this.review = data;
        if (this.reviewEvent) {
          this.updateReviewEvent();
          this.notify();
        } else {
          this.submitted = true;
        }
        // this.goBack();
      });
  }

  updateReviewEvent() {
    this.reviewsService.getReviews(0, -1, "event_id,author_id,comment,review_rating")
      .subscribe((data: Review[]) => {
        const eventReviews = data.filter(review => this.reviewEvent && review.event_id === this.reviewEvent.id && review.review_rating !== undefined);
        let sum = eventReviews.reduce((sum, review) => review.review_rating !== undefined ? (sum + review.review_rating) : sum, 0);
        if (this.reviewEvent) {
          this.reviewEvent.event_rating = eventReviews.length > 0 ? sum / eventReviews.length : undefined;
          this.eventsService.addUpdateEvent(this.reviewEvent)
            .subscribe((data: Event) => {
              this.reviewEvent = data;
              this.submitted = true;
            });
        }
      });
  }

  deleteReview(): void {
    if (!this.review || !this.review.id) {
      return;
    }

    this.confirmation.openConfirmation("Are you sure?", "Do you want to delete \"" + this.review.comment + "\" Review?")
      .then(result => {
        if (result && this.review && this.review.id) {
          this.reviewsService.deleteReview(this.review)
            .subscribe((data: Review) => {
              this.submitted = true;
              this.goBack();
            });
        }
      });
  }

  getReviewTaster() {
    if (this.review && this.review.author_id) {
      this.tastersService.getTasterById(this.review.author_id).subscribe((data: Taster) => {
        this.reviewTaster = data;
      }, err => {
        this.reviewTaster = null;
      });
    } else {
      this.reviewTaster = null;
    }
  }

  get reviewerName() {
    return this.reviewTaster ? this.reviewTaster.name : 'Anonymous';
  }

  getReviewEvent() {
    if (this.review && this.review.event_id) {
      this.eventsService.getEventById(this.review.event_id).subscribe((data: Event) => {
        this.reviewEvent = data;
      }, err => {
        this.reviewEvent = null;
      });
    } else {
      this.reviewEvent = null;
    }
  }

  getReviewTasters() {
    this.tastersService.getTasters(0, -1, "name,email,notifyReviews")
      .subscribe((tasters: Taster[]) => {
        this.reviewsTasters = tasters;
      }, (err) => {
        this.reviewsTasters = null;
      });
  }

  get portionValue(): number {
    if (!this.reviewEvent || !this.reviewEvent.price || !this.reviewEvent.portion) {
      return 0;
    } else {
      return this.reviewEvent.price / this.reviewEvent.portion;
    }
  }


  get isLoggedIn(): boolean {
    return this.currentTaster !== undefined && this.review != null && this.review.author_id === this.currentTaster.id;
  }

  private updateReviewRating() {
    const allRatings: number[] = [];

    const resolve = (path: string, obj: any) => {
      return path.split('.').reduce((prev, curr) => {
        return prev ? prev[curr] : null
      }, obj || self)
    };

    const addRating = (rating?: number, weight: number = 1) => {
      if (rating !== null && rating !== undefined) {
        allRatings.push(rating * weight);
      }
    };

    // place
    addRating(resolve('place.parking', this.review));
    addRating(resolve('place.ambiance', this.review));
    addRating(resolve('place.service', this.review));
    addRating(resolve('place.wait_time', this.review));
    addRating(resolve('place.cleanliness', this.review));
    // wings
    addRating(resolve('wings.moistness', this.review), 1);  //TODO: everything about wings is more important. (*3?)
    addRating(resolve('wings.sauce', this.review), 1);      //TODO: everything about wings is more important.  (*3?)
    addRating(resolve('wings.taste', this.review), 1);      //TODO: after all, wings taste is the most important! (*10?)
    addRating(resolve('wings.satiety', this.review), 1);
    //sides
    addRating(resolve('sides.appetizer.rating', this.review));
    addRating(resolve('sides.side.rating', this.review));
    addRating(resolve('sides.drink.rating', this.review));

    let sum = allRatings.reduce((sum, rating) => sum + rating, 0);
    let reviewRating = allRatings.length > 0 ? sum / allRatings.length : undefined;
    if (this.review) {
      this.review.review_rating = reviewRating;
    }
    return reviewRating;
  }

  onPhotoUpload = (formData: FormData, httpParams: any): Observable<any> => {
    if (!this.review) {
      throw 'this.review must exist first!';
    }
    return this.reviewsService.uploadReviewPhoto(this.review, formData);
  };

  deleteImage(image: string) {
    if (!this.review) {
      throw 'this.review must exist first!';
    }

    this.confirmation.openConfirmation("Are you sure?", "Do you want to delete \"" + image + "\" Image?")
      .then(result => {
        if (result && this.review) {
          this.reviewsService.deleteReviewPhoto(this.review, image)
            .subscribe(review => {
              return review;
            });
        }
      });
  }

  private notify() {
    if (!this.review?.notifications) {
      this.sendNewReviewMessage();
    } else {
      this.confirmation.openConfirmation("Notifications?", "Do you also want to re-send this Review notifications?")
        .then(result => {
          if (result) {
            this.sendNewReviewMessage();
          }
        });
    }
  }

  /**
   * Send out email schedule notifications
   */
  private sendNewReviewMessage() {
    if (!this.review || !this.reviewEvent || !this.reviewsTasters || !this.review.event_id) {
      //throw 'Event has to be defined, have the Date and Location set';
      return;
    }

    this.mailSent = false;
    this.mailErr = undefined;

    const mailItem = new MailItem();
    mailItem.from = new Recipient(this.currentTasterName, this.currentTaster?.email);

    this.reviewsTasters.forEach(taster => {
      if (taster.notifyReviews) {
        mailItem.addTo(new Recipient(taster?.name, taster?.email));
      }
    });
   // mailItem.addTo(new Recipient(this.currentTaster?.name, this.currentTaster?.email)); //// #TEST

    mailItem.subject='New Wings Review';
    mailItem.plainText = `${this.currentTasterName} left a new Review for ${this.reviewEvent.eventDateTimeStr}`;
    const eventUrl = this.reviewEvent.id ? (HOST_BASE_URL + "/events/" + this.reviewEvent.id) : null;
    const reviewUrl = this.review.id ? (HOST_BASE_URL + "/reviews/" + this.review.id) : null;

    const formatReviewRatingText = () => {
      if (this.review?.review_rating == null || this.review?.review_rating == undefined) {
        return '';
      }
      return `- <b style="font-size: x-large;">${this.reviewRatingText}</b>`;
    };

    // populate rich html portion
    mailItem.htmlText = `<p>
        <b>${this.currentTasterName}</b> left a new Review for
        <a href="${eventUrl}" target="_blank">
          <img style='vertical-align:middle' height='60px' src='cid:event'>
          Wings Event
        </a>
        at <b><i>${this.reviewEvent.eventDateTimeStr}</i></b>
      </p>
      <p>
       <a href="${reviewUrl}" target="_blank">
        <b>"${this.review.comment}"</b>
       </a>
        ${formatReviewRatingText()}
      </p>
      `;
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
      if(this.review){
        this.review.notifications = !this.review.notifications ? 1 : this.review.notifications + 1;
        this.reviewsService.addUpdateReview(this.review)
          .subscribe((data: Review) => {
            this.review = data;
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
