import {Component, OnInit} from '@angular/core';
import {Event} from "./event";
import {ConfirmDialogService} from "../components/confirmation-dialog/confirmation-dialog.service";
import {EventsService} from "./events.service";
import {ActivatedRoute, Router} from "@angular/router";
import {TastersService} from "../tasters/tasters.service";
import {AbstractTasterComponent} from "../components/abstract-components/abstract.taster.component";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less']
})
export class EventsComponent extends AbstractTasterComponent implements OnInit {

  events!: Event[] | null;
  displayEvents!: Event[] | null;
  topEvents!: Event[] | null;

  constructor(private route: ActivatedRoute, private router: Router, private eventsService: EventsService, private confirmation: ConfirmDialogService,
              tasterService: TastersService) {
    super(tasterService);
  }

  ngOnInit(): void {
    this.getAllEvents();
  }

  getAllEvents(): void {
    this.eventsService.getEvents()
      .subscribe((data: Event[]) => {
        this.events = data;
        this.displayEvents = this.events;
        this.topEvents = this.getTopEvents(3);
      }, err => {
        this.events = null;
        this.displayEvents = [];
        this.topEvents = [];
      });
  }

  getTopEvents(num: number | null = null): Event[] | null {
    if (!this.events) {
      return null;
    }

    let topEvents = [...this.events];
    topEvents.sort((left: Event, right: Event) => {
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

    if (num) {
      topEvents = topEvents.slice(0, num);
    }

    return topEvents;
  }

  findEventTop(event: Event): number {
    if (!this.topEvents) {
      return -1;
    }

    let pos = this.topEvents.findIndex(ev => ev.id == event.id && ev.event_rating);   // FIXME: '==' is intentional!

    return pos >= 0 ? pos + 1 : -1;
  }

  onSelect = (event?: Event): void => {
    const url: string = "/events/" + (event ? event.id : '');
    this.router.navigateByUrl(url);
  };

  newEvent() {
    const url: string = "/events/0";
    this.router.navigateByUrl(url);
  }

  trackByFn(index: number, item: Event) {
    return item.id  // or index
  }
}
