import {Component, OnInit} from "@angular/core";
import {Event} from "../event";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmDialogService} from "../../components/confirmation-dialog/confirmation-dialog.service";
import {EventsService} from "../events.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EventPlacePickerComponent} from "../place-picker/event.place-picker.component";
import {Place} from "../../places/place";
import {PlacesService} from "../../places/places.service";
import {Review} from "../../reviews/review";
import {ReviewsService} from "../../reviews/reviews.service";

@Component({
  selector: 'events-details',
  templateUrl: './events.details.component.html',
  styleUrls: ['./events.details.component.less']
})
export class EventsDetailsComponent implements OnInit {

  selectedEvent!: Event | null;
  submitted: boolean = false;
  eventPlace?: Place | null;
  eventReviews?: Review[] | null;

  constructor(private route: ActivatedRoute, private router: Router, private eventsService: EventsService,
              private placesService: PlacesService, private reviewsService: ReviewsService,
              private confirmation: ConfirmDialogService, private modalService: NgbModal) {
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
      } else if (id) {
        this.eventsService.getEventById(id).subscribe((data: Event) => {
          this.selectedEvent = data;
          this.getEventPlace();
          this.getEventReviews();
        }, err => {
          this.selectedEvent = null;
          this.eventPlace = null;
          this.eventReviews = null;
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
    this.reviewsService.getReviews(0, -1, "event_id,author_id,comment,review_rating")
      .subscribe((data: Review[]) => {
        this.eventReviews = data.filter(review => this.selectedEvent && review.event_id === this.selectedEvent.id);
      }, err => {
        this.eventReviews = null;
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
              this.submitted = true;
              this.goBack();
            });
        }
      });
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
    const url: string = "/reviews/0?event_id=" + this.selectedEvent.id;
    this.router.navigateByUrl(url);
  }

  onSelectReview = (review: Review): void => {
    const url: string = "/reviews/" + review.id;
    this.router.navigateByUrl(url);
  };
}
