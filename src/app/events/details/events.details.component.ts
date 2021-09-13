import {Component, OnInit} from "@angular/core";
import {Event} from "../event";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmDialogService} from "../../components/confirmation-dialog/confirmation-dialog.service";
import {EventsService} from "../events.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EventPlacePickerComponent} from "../place-picker/event.place-picker.component";
import {Place} from "../../places/place";
import {PlacesService} from "../../places/places.service";

@Component({
  selector: 'events-details',
  templateUrl: './events.details.component.html',
  styleUrls: ['./events.details.component.less']
})
export class EventsDetailsComponent implements OnInit {

  selectedEvent!: Event | null;
  submitted: boolean = false;
  eventPlace?: Place;

  constructor(private route: ActivatedRoute, private router: Router, private eventsService: EventsService, private placesService: PlacesService, private confirmation: ConfirmDialogService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id == 0) {
        this.makeNewEvent();
      } else if (id) {
        this.eventsService.getEventById(id).subscribe((data: any) => {
          this.selectedEvent = data;
          this.getEventPlace();
        }, err => {
          this.selectedEvent = null;
          this.getEventPlace();
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
    this.selectedEvent.title = "New Event";
    // this.selectedEvent.date = new Date();
  }

  getEventPlace() {
    if (this.selectedEvent && this.selectedEvent.place_id) {
      this.placesService.getPlaceById(this.selectedEvent.place_id).subscribe((data: any) => {
        this.eventPlace = data;
        if (this.selectedEvent && this.eventPlace) {
          this.selectedEvent.title = this.eventPlace.title;
        }
      }, err => {
        this.eventPlace = undefined;
        // if (this.selectedEvent) {
        //   this.selectedEvent.title = undefined;
        // }
      });
    } else {
      this.eventPlace = undefined;
      if (this.selectedEvent) {
        this.selectedEvent.title = "-no place-";
      }
    }
  }

  get eventPlaceName() {
    return this.eventPlace ? this.eventPlace.title : (this.selectedEvent && this.selectedEvent.place_id ? ('Place id: ' + this.selectedEvent.place_id) : 'select a Place');
  }

  onSubmit(): void {
    if (!this.selectedEvent) {
      return;
    }
    this.eventsService.addUpdateEvent(this.selectedEvent)
      .subscribe((data: any) => {
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
            .subscribe((data: any) => {
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
      if (result && this.selectedEvent && this.selectedEvent.id) {
        this.getEventPlace();
      }
    });
  }
}
