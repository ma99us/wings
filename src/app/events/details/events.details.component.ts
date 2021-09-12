import {Component, OnInit} from "@angular/core";
import {Event} from "../event";
import {ActivatedRoute, Router} from "@angular/router";
import {ConfirmDialogService} from "../../components/confirmation-dialog/confirmation-dialog.service";
import {EventsService} from "../events.service";

@Component({
  selector: 'events-details',
  templateUrl: './events.details.component.html',
  styleUrls: ['./events.details.component.less']
})
export class EventsDetailsComponent implements OnInit {

  selectedEvent!: Event | null;
  submitted: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private eventsService: EventsService, private confirmation: ConfirmDialogService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id == 0) {
        this.selectedEvent = new Event();
        this.selectedEvent.date = new Date(); //FIXME: Carlo's fix goes here
      } else if (id) {
        this.eventsService.getEventById(id).subscribe((data: any) => {
          this.selectedEvent = data;
        }, err => {
          this.selectedEvent = null;
        });
      }
    });
  }

  goBack() {
    const url: string = "/events";
    this.router.navigateByUrl(url);
  }

  onSubmit(): void {
    if (!this.selectedEvent) {
      return;
    }
    this.eventsService.addUpdateEvent(this.selectedEvent)
      .subscribe((data: any) => {
        this.selectedEvent = data;
        this.submitted = true;
        // this.goBack();
      });
  }

  deleteEvent(): void {
    if (!this.selectedEvent || !this.selectedEvent.id) {
      return;
    }

    this.confirmation.openConfirmation("Are you sure?", "Do you want to delete \"" + this.selectedEvent.title + "\"?")
      .then(result => {
        if (result && this.selectedEvent && this.selectedEvent.id) {
          this.eventsService.deleteEvent(this.selectedEvent)
            .subscribe((data: any) => {
              this.submitted = true;
              this.goBack();
            });
        }
      });
  }
}
