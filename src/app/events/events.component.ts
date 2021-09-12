import {Component, OnInit} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Event} from "./event";
import {ConfirmDialogService} from "../components/confirmation-dialog/confirmation-dialog.service";
import {EventsService} from "./events.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less']
})
export class EventsComponent implements OnInit {

  events!: Event[] | null;
  displayEvents!: Event[] | null;

  constructor(private route: ActivatedRoute, private router: Router, private eventsService: EventsService, private confirmation: ConfirmDialogService) {
  }

  ngOnInit(): void {
    this.getAllEvents();
  }

  getAllEvents(): void {
    this.eventsService.getEvents()
      .subscribe((data: any) => {
        this.events = data;
        this.displayEvents = this.events;
      }, err => {
        this.events = null;
        this.displayEvents = [];
      });
  }

  onSelect = (event?: Event): void => {
    const url: string = "/events/" + (event ? event.id : '');
    this.router.navigateByUrl(url);
  };

  newEvent() {
    const url: string = "/events/0";
    this.router.navigateByUrl(url);
  }
}
