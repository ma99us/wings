import {Component, Input, OnInit} from "@angular/core";
import {Event} from "../event";
import {EventsService} from "../events.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Place} from "../../places/place";
import {PlacesService} from "../../places/places.service";

@Component({
  selector: 'event-place-picker',
  templateUrl: './event.place-picker.component.html',
  styleUrls: ['./event.place-picker.component.less']
})
export class EventPlacePickerComponent implements OnInit {

  @Input() selectedEvent!: Event;
  submitted: boolean = false;
  places!: Place[] | null;
  displayPlaces!: Place[] | null;

  constructor(public activeModal: NgbActiveModal, private eventsService: EventsService, private placesService: PlacesService) {
  }

  ngOnInit(): void {
    this.getAllPlaces();
  }

  getAllPlaces(): void {
    this.placesService.getPlacesNames()
      .subscribe((data: any) => {
        this.places = data;
        this.onSearchChange();
      }, err => {
        this.places = null;
        this.onSearchChange();
      });
  }

  isSelected(place: Place): boolean {
    return this.selectedEvent && this.selectedEvent.place_id === place.id;
  }

  onSelect = (place?: Place): void => {
    this.selectedEvent.place_id = place ? place.id : null;
    this.activeModal.close(true);
  };

  onSearchChange = (title: string = ''): void => {
    this.displayPlaces = this.places ? this.places.filter((place: Place) => {
      return place.title && place.title.toLowerCase().includes(title.toLowerCase());
    }) : [];
  };
}
