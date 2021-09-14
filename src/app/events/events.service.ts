import {Injectable} from '@angular/core';
import {MikeDbService} from "../services/mike-db.service";
import {Event} from "./event";
import {Observable} from "rxjs/internal/Observable";
import {map, switchMap} from "rxjs/operators";
import {from} from "rxjs/internal/observable/from";

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private mikeDb: MikeDbService) {
  }

  getEventById(id: number): Observable<Event> {
    return this.mikeDb.get<Event>("events/" + id)
      .pipe(
        map(data => new Event(data))
      );
  }

  getEvents(): Observable<Event[]> {
    return this.mikeDb.get<Event[]>("events")
      .pipe(
        map(data => data.map(event => new Event(event)).sort((first: Event, second: Event) => {
          return (!first.date || !second.date) ? 0 : -first.date.localeCompare(second.date);  // sort by date, newer - first
        }))
      );
  }

  addUpdateEvent(event: Event): Observable<Event> {
    if (!event.id) {
      // add new
      return this.mikeDb.add<Event>("events", event, 0)
        .pipe(
          map(data => new Event(data))
        );
    } else {
      // update existing
      return this.mikeDb.update<Event>("events", event)        .pipe(
        map(data => new Event(data))
      );
    }
  }

  deleteEvent(event: Event): Observable<Event> {
    return this.mikeDb.delete<Event>("events", event);
  }
}
