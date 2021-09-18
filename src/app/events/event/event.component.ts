import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {Event} from "../event";

@Component({
  selector: 'event-li',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.less']
})
export class EventComponent implements OnChanges, OnInit {

  @Input() event!: Event;
  @Input() selectedEvent?: Event;
  @Input() onSelect!: (event?: Event) => void;
  diffDays?: number;

  constructor() {
  }

  get isSelected(): boolean {
    return this.event != undefined && this.selectedEvent != undefined && (this.event === this.selectedEvent || this.event.id === this.selectedEvent.id);
  }

  get note(): DaysDiff {
    if (this.diffDays == undefined) {
      return new DaysDiff(null);
    }
    if (this.diffDays === 0) {
      return new DaysDiff(this.diffDays, 'Yey! It\'s Today');
    } else if (this.diffDays === 1) {
      return new DaysDiff(this.diffDays, 'Tomorrow');
    } else if (this.diffDays > 1 && this.diffDays <= 7) {
      return new DaysDiff(this.diffDays, `Coming up in ${this.diffDays} days`);
    } else if (this.diffDays > 7) {
      return new DaysDiff(this.diffDays, `In ${this.diffDays} days`);
    } else if (this.diffDays == -1) {
      return new DaysDiff(this.diffDays, "Yesterday");
    } else {
      return new DaysDiff(null);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    const eventDate = this.event ? this.event.getEventDate() : undefined;
    if(eventDate){
      const diff = eventDate.getTime() - new Date().getTime();
      this.diffDays = Math.ceil(diff / (1000 * 3600 * 24));
    }
  }
}

export class DaysDiff {
  days: number | null = null;
  text: string | null = null;

  constructor(days: number | null, text: string | null = null ){
    this.days = days;
    this.text = text;
  }

  get isComingup(): boolean {
    return this.days != null && this.days > 0 && this.days < 7;
  }

  get isToday(): boolean {
    return this.days != null && this.days === 0;
  }
}