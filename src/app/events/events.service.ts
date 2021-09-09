import {Injectable} from '@angular/core';
import {MikeDbService} from "../mike-db.service";
import {Event} from "./event";

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private mikeDb: MikeDbService) {
  }

  getEvents() {
    return this.mikeDb.get("events");
  }

  addUpdateEvent(event: Event){
    if (!event.id) {
      // add new
      return this.mikeDb.add("events", event, 0);
    } else {
      // update existing
      return this.mikeDb.update("events", event);
    }
  }

  deleteEvent(event: Event) {
    return this.mikeDb.delete("events", event);
  }
}
