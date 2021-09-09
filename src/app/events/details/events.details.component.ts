import {Component, Input} from "@angular/core";
import {Event} from "../event";

@Component({
  selector: 'events-details',
  templateUrl: './events.details.component.html',
  styleUrls: ['./events.details.component.less']
})
export class EventsDetailsComponent {

  @Input() selectedEvent?: Event;
  @Input() onSelect!: (event?: Event) => void;
  @Input() submitted!: boolean;
  @Input() onSubmit!: () => void;
  @Input() deleteEvent!: () => void;

  constructor() {
  }
}
