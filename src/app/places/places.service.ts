import {Injectable} from '@angular/core';
import {MikeDbService} from "../mike-db.service";
import {Place} from "./place";

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  constructor(private mikeDb: MikeDbService) {
  }

  getPlaceById(id: number) {
    return this.mikeDb.get("places/" + id);
  }

  getPlaces() {
    return this.mikeDb.get("places");
  }

  addUpdatePlace(place: Place){
    if (!place.id) {
      // add new Place
      return this.mikeDb.add("places", place, 0);
    } else {
      // update existing Place
      return this.mikeDb.update("places", place);
    }
  }

  deletePlace(place: Place) {
    return this.mikeDb.delete("places", place);
  }
}
