import {Component, Input} from "@angular/core";
import {Place} from "../place";

@Component({
  selector: 'places-details',
  templateUrl: './places.details.component.html',
  styleUrls: ['./places.details.component.less']
})
export class PlacesDetailsComponent {

  @Input() selectedPlace?: Place;
  @Input() onSelect!: (place?: Place) => void;
  @Input() submitted!: boolean;
  @Input() onSubmit!: () => void;
  @Input() deletePlace!: () => void;

  constructor() {
  }
}
