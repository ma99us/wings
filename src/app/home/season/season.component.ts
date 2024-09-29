import {Component, Input, OnInit} from '@angular/core';
import {Event} from "../../events/event";
import {EventsService} from "../../events/events.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.less']
})
export class SeasonComponent implements OnInit {
  @Input() season!: Number
  @Input() from!: Date
  @Input() to!: Date

  totalEvents: number = 0;
  bestEvents: Event[] = [];
  worstEvent: Event | null = null;
  isLoading: boolean = true;  // start in loading state

  constructor(private eventsService: EventsService,
              private router: Router) { }

  ngOnInit(): void {
    this.getSeasonEvents();
  }

  getSeasonEvents(): void {
    this.isLoading = true;
    this.eventsService.getEvents()
      .subscribe((data: Event[]) => {
        let events = data.filter(e => e.eventDate && e.eventDate >= this.from && e.eventDate <= this.to);
        this.totalEvents = events.length;
        this.bestEvents = this.getTopEvents(events, 3, true) || [];
        let worstEvents = this.getTopEvents(events, 1, false) || [];
        this.worstEvent = worstEvents.length ? worstEvents[0] : null;
        this.isLoading = false;
      }, err => {
        console.error(err)
        this.isLoading = false;
      });
  }

  getTopEvents(events: Event[], num: number = 3, best: boolean = true): Event[] | null {
    events.sort((left: Event, right: Event) => {
      if (left.event_rating == undefined && right.event_rating == undefined) {
        return 0;
      } else if (left.event_rating != undefined && right.event_rating == undefined) {
        return -1;
      } else if (left.event_rating == undefined && right.event_rating != undefined) {
        return 1;
      } else {
        // @ts-ignore
        return left.event_rating > right.event_rating ? -1 : 1;
      }
    });

    if (best) {
      events = events.slice(0, num);
    } else {
      events = events.slice(-num);
    }

    return events;
  }

  onSelect = (event?: Event): void => {
    const url: string = "/events/" + (event ? event.id : '');
    this.router.navigateByUrl(url);
  };


  trackByFn(index: number, item: Event) {
    return item.id  // or index
  }
}
