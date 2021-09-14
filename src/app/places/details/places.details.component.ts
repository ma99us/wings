import {Component, Input, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Place} from "../place";
import {ConfirmDialogService} from "../../components/confirmation-dialog/confirmation-dialog.service";
import {PlacesService} from "../places.service";
import {Event} from"../../events/event"
import {EventsService} from "../../events/events.service";

@Component({
  selector: 'places-details',
  templateUrl: './places.details.component.html',
  styleUrls: ['./places.details.component.less']
})
export class PlacesDetailsComponent implements OnInit {

  selectedPlace!: Place | null;
  submitted = false;
  placeEvents?: Event[] | null;

  constructor(private route: ActivatedRoute, private router: Router, private placesService: PlacesService, private eventsService: EventsService, private confirmation: ConfirmDialogService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id == 0) {
        this.selectedPlace = new Place();
      } else if (id) {
        this.placesService.getPlaceById(id).subscribe((data: Place) => {
          this.selectedPlace = data;
          this.getPlaceEvents();
        }, err => {
          this.selectedPlace = null;
        });
      }
    });
  }


  goBack() {
    const url: string = "/places";
    this.router.navigateByUrl(url);
  }

  onSubmit(): void {
    if (!this.selectedPlace) {
      return;
    }
    this.placesService.addUpdatePlace(this.selectedPlace)
      .subscribe((data: Place) => {
        this.selectedPlace = data;
        this.submitted = true;
        // this.goBack();
      });
  }

  deletePlace(): void {
    if (!this.selectedPlace || !this.selectedPlace.id) {
      return;
    }

    this.confirmation.openConfirmation("Are you sure?", "Do you want to delete \"" + this.selectedPlace.title + "\" Place?")
      .then(result => {
        if (result && this.selectedPlace && this.selectedPlace.id) {
          this.placesService.deletePlace(this.selectedPlace)
            .subscribe((data: Place) => {
              this.submitted = true;
              this.goBack();
            });
        }
      });
  }

  getPlaceEvents(): void  {
    this.eventsService.getEvents(0, -1, "title,place_id,date")
      .subscribe((data: Event[]) => {
        this.placeEvents = data.filter(event => this.selectedPlace && event.place_id === this.selectedPlace.id);
      }, err => {
        this.placeEvents = null;
      });
  }

  onSelectEvent = (event?: Event): void => {
    if (!event) {
      return;
    }
    const url: string = "/events/" + event.id;
    this.router.navigateByUrl(url);
  };

  newEvent() {
    if (!this.selectedPlace) {
      return;
    }
    const url: string = "/events/0?place_id=" + this.selectedPlace.id;
    this.router.navigateByUrl(url);
  }
}
