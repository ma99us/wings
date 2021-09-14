import {Component, Input} from "@angular/core";
import {Place} from "../place";
import {Event} from "../../events/event"

@Component({
  selector: 'place-li',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.less']
})
export class PlaceComponent {

  @Input() place!: Place;
  @Input() selectedPlace?: Place;
  @Input() onSelect!: (place?: Place) => void;
  @Input() placeEvents?: Event[] | null;
  @Input() onPlaceEventClick!: (event: Event) => void;

  constructor() {
  }

  get isSelected(): boolean {
    return this.place != undefined && this.selectedPlace != undefined && (this.place === this.selectedPlace || this.place.id === this.selectedPlace.id);
  }
}
