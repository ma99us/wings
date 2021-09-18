import {Injectable} from '@angular/core';
import {MikeDbService} from "../services/mike-db.service";
import {Observable} from "rxjs/internal/Observable";
import {map} from "rxjs/operators";
import {Review} from "./review";

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {

  constructor(private mikeDb: MikeDbService) {
  }

  getReviewById(id: number): Observable<Review> {
    return this.mikeDb.get<Review>("reviews/" + id)
      .pipe(
        map(data => new Review(data))
      );
  }

  getReviewEvent(firstResult = 0, maxResults = -1): Observable<Review[]> {
    return this.getReviews(firstResult, maxResults, "event_id,author_id");
  }

  getReviews(firstResult = 0, maxResults = -1, fields: string | null = null): Observable<Review[]> {
    return this.mikeDb.get<Review[]>("reviews", firstResult, maxResults, fields)
      .pipe(
        map(data => data.map(event => new Review(event)))
      );
  }

  addUpdateReview(review: Review): Observable<Review> {
    if (!review.id) {
      // add new
      return this.mikeDb.add<Review>("reviews", review, 0)
        .pipe(
          map(data => new Review(data))
        );
    } else {
      // update existing
      return this.mikeDb.update<Review>("reviews", review)
        .pipe(
          map(data => new Review(data))
        );
    }
  }

  deleteReview(event: Review): Observable<Review> {
    return this.mikeDb.delete<Review>("reviews", event);
  }
}
