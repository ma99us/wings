import {Component, Inject, OnInit} from '@angular/core';
import {AppComponent} from "../app.component";
import {EventsService} from "../events/events.service";
import {Event} from "../events/event";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  nextEvent?: Event | null;
  prevEvent?: Event | null;

  constructor(@Inject(AppComponent) private parent: AppComponent,
              private router: Router,
              private eventsService: EventsService) { }

  ngOnInit(): void {
    this.findPrevNextEvents();
  }

  findPrevNextEvents(): void {
    this.eventsService.getEvents(0, -1, "title,place_id,date,event_rating")
      .subscribe((data: Event[]) => {
        const now = new Date().getTime();
        data.forEach(event => {
          const eventDate = event.eventDate;
          const nextEventDate = this.nextEvent ? this.nextEvent.eventDate : undefined;
          const prevEventDate = this.prevEvent ? this.prevEvent.eventDate : undefined;
          const diff = eventDate ? eventDate.getTime() - now : undefined;
          const nextDiff = (eventDate && nextEventDate) ? nextEventDate.getTime() - eventDate.getTime() : undefined;
          const prevDiff = (eventDate && prevEventDate) ? prevEventDate.getTime() - eventDate.getTime() : undefined;
          if(diff != undefined && diff >= 0 && (nextDiff === undefined || nextDiff > 0)){
            //  next closes future event
            this.nextEvent = event;
          } else if(diff != undefined && diff < 0 && (prevDiff === undefined || prevDiff < 0)) {
            //  prev closes past event
            this.prevEvent = event;
          }
        });
      }, err => {
        this.nextEvent = null;
        this.prevEvent = null;
      });
  }

  onLoginClick() {
    this.parent.login();
  }

  onSelect = (event?: Event): void => {
    const url: string = "/events/" + (event ? event.id : '');
    this.router.navigateByUrl(url);
  };
}
