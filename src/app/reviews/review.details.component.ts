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
export class ReviewDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('reviewForm', {static: true}) form!: NgForm;
  formChangesSubscription: any;
  review!: Review | null;
  submitted: boolean = false;
  reviewEvent!: Event | null;

  constructor(private route: ActivatedRoute, private router: Router, private reviewsService: ReviewsService, private eventsService: EventsService, private confirmation: ConfirmDialogService, private modalService: NgbModal) {
    // console.log('Form ', this.form);
    // this.form.valueChanges.subscribe((data: any) => {
    //   console.log('Form changes', data);
    // })
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id == 0) {
        this.makeNewReview();
        if (this.review) {
          this.review.event_id = Number(this.route.snapshot.queryParamMap.get('event_id'));
        }
        this.getReviewEvent();
      } else if (id) {
        this.reviewsService.getReviewById(id).subscribe((data: Review) => {
          this.review = data;
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
    //this.review.author_id = myself;
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
          this.eventsService.addUpdateEvent(this.reviewEvent)
            .subscribe((data: Event) => {
              this.reviewEvent = data;
              this.submitted = true;
            });
        } else {
          this.submitted = true;
        }
        // this.goBack();
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
    addRating(resolve('wings.moistness', this.review), 3);  // everything about wings is more important
    addRating(resolve('wings.sauce', this.review), 3);      // everything about wings is more important
    addRating(resolve('wings.taste', this.review), 10);     // after all, wings taste is the most important!
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
}
