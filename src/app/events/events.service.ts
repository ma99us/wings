import {Injectable} from '@angular/core';
import {MikeDbService} from "../services/mike-db.service";
import {Event} from "./event";
import {Observable} from "rxjs/internal/Observable";
import {map} from "rxjs/operators";

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

  getEventsPlaces(firstResult = 0, maxResults = -1): Observable<Event[]> {
    return this.getEvents(firstResult, maxResults, "date,place_id");
  }

  getEvents(firstResult = 0, maxResults = -1, fields: string | null = null): Observable<Event[]> {
    return this.mikeDb.get<Event[]>("events", firstResult, maxResults, fields)
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
