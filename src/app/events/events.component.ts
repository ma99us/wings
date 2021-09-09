import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {Event} from "./event";
import {ConfirmDialogService} from "../components/confirmation-dialog/confirmation-dialog.service";
import {EventsService} from "./events.service";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.less']
})
export class EventsComponent implements OnInit {

  selectedEvent?: Event;
  events: Event[] = [];
  displayEvents: Event[] = [];
  submitted = false;

  constructor(private eventsService: EventsService, private confirmation: ConfirmDialogService) {
  }

  ngOnInit(): void {
    this.getAllEvents();
  }

  getAllEvents(): void {
    this.eventsService.getEvents()
      .subscribe((data: any) => {
        this.events = data;
        this.displayEvents = this.events;
      });
  }

  onSelect = (event?: Event): void => {
    this.selectedEvent = event;
    this.submitted = false;
  };

  onSubmit = () : void => {
    if (!this.selectedEvent) {
      return;
    }
    this.eventsService.addUpdateEvent(this.selectedEvent)
      .subscribe((data: any) => {
        this.selectedEvent = data;
        this.submitted = true;
        this.getAllEvents();
      });
  };

  newEvent() {
    this.selectedEvent = new Event();
    this.selectedEvent.date = new Date();
    //const datepipe: DatePipe = new DatePipe('en-US');
    //this.selectedEvent.date = datepipe.transform(this.selectedEvent.date, 'YYYY-MM-DD');
    this.submitted = false;
  }

  deleteEvent = (): void => {
    if (!this.selectedEvent || !this.selectedEvent.id) {
      this.selectedEvent = undefined;
      return;
    }

    this.confirmation.openConfirmation("Are you sure?", "Do you want to delete \"" + this.selectedEvent.title + "\"?")
      .then(result => {
        if (result && this.selectedEvent && this.selectedEvent.id) {
          this.eventsService.deleteEvent(this.selectedEvent)
            .subscribe((data: any) => {
              this.selectedEvent = undefined;
              this.submitted = true;
              this.getAllEvents();
            });
        }
      });
  };
}
