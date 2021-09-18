import {Injectable} from '@angular/core';
import {MikeDbService} from "../services/mike-db.service";
import {Observable} from "rxjs/internal/Observable";
import {map} from "rxjs/operators";
import {Taster} from "./taster";

@Injectable({
  providedIn: 'root'
})
export class TastersService {

  constructor(private mikeDb: MikeDbService) {
  }

  getTasterById(id: number): Observable<Taster> {
    return this.mikeDb.get<Taster>("tasters/" + id)
      .pipe(
        map(data => new Taster(data))
      );
  }

  getTasters(firstResult = 0, maxResults = -1, fields: string | null = null): Observable<Taster[]> {
    return this.mikeDb.get<Taster[]>("tasters", firstResult, maxResults, fields)
      .pipe(
        map(data => data.map(value => new Taster(value)))
      );
  }

  addUpdateTaster(taster: Taster): Observable<Taster> {
    if (!taster.id) {
      // add new
      return this.mikeDb.add<Taster>("tasters", taster, 0)
        .pipe(
          map(data => new Taster(data))
        );
    } else {
      // update existing
      return this.mikeDb.update<Taster>("tasters", taster)
        .pipe(
          map(data => new Taster(data))
        );
    }
  }

  deleteTaster(taster: Taster): Observable<Taster> {
    return this.mikeDb.delete<Taster>("tasters", taster);
  }
}
