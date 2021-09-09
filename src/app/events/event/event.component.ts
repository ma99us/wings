import {Component, Input} from "@angular/core";
import {Event} from "../event";

@Component({
  selector: 'event-li',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.less']
})
export class EventComponent {

  @Input() event!: Event;
  @Input() selectedEvent?: Event;
  @Input() onSelect!: (event?: Event) => void;

  constructor() {
  }

  get isSelected(): boolean {
    return this.event != undefined && this.selectedEvent != undefined && (this.event === this.selectedEvent || this.event.id === this.selectedEvent.id);
  }
}
