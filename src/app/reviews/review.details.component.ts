import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from "@angular/core";
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

  constructor(private route: ActivatedRoute, private router: Router, private reviewsService: ReviewsService,
              private eventsService: EventsService, private confirmation: ConfirmDialogService, private modalService: NgbModal,
              tasterService: TastersService) {
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
      } else if (id) {
        this.reviewsService.getReviewById(id).subscribe((data: Review) => {
          this.review = data;
          this.getReviewTaster();
          this.getReviewEvent();
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
}
