import {Component, Input} from "@angular/core";
import {Place} from "../place";

@Component({
  selector: 'place-li',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.less']
})
export class PlaceComponent {

  @Input() place!: Place;
  @Input() selectedPlace?: Place;
  @Input() onSelect!: (place?: Place) => void;

  constructor() {
  }

  get isSelected(): boolean {
    return this.place != undefined && this.selectedPlace != undefined && (this.place === this.selectedPlace || this.place.id === this.selectedPlace.id);
  }
}
