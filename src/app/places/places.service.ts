import {Injectable} from '@angular/core';
import {MikeDbService} from "../services/mike-db.service";
import {Place} from "./place";
import {Observable} from "rxjs/internal/Observable";
import {map} from "rxjs/operators";
import {Event} from "../events/event";

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(private mikeDb: MikeDbService) {
  }

  getPlaceById(id: number): Observable<Place> {
    return this.mikeDb.get<Place>("places/" + id)
      .pipe(
        map(data => new Place(data))
      );
  }

  getPlacesNames(firstResult = 0, maxResults = -1): Observable<Place[]> {
    return this.mikeDb.get<Place[]>("places", firstResult, maxResults, "title")
      .pipe(
        map(data => data.map(place => new Place(place)))
      );
  }

  getPlaces(firstResult = 0, maxResults = -1, fields: string | null = null): Observable<Place[]> {
    return this.mikeDb.get<Place[]>("places", firstResult, maxResults, fields)
      .pipe(
        map(data => data.map(place => new Place(place)))
      );
  }

  addUpdatePlace(place: Place): Observable<Place> {
    if (!place.id) {
      // add new Place
      return this.mikeDb.add<Place>("places", place, 0)
        .pipe(
          map(data => new Place(data))
        );
    } else {
      // update existing Place
      return this.mikeDb.update<Place>("places", place)
        .pipe(
          map(data => new Place(data))
        );
    }
  }

  deletePlace(place: Place): Observable<Place> {
    return this.mikeDb.delete<Place>("places", place);
  }
}
