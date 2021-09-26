import {Injectable} from '@angular/core';
import {MikeDbService} from "../services/mike-db.service";
import {Observable} from "rxjs/internal/Observable";
import {map} from "rxjs/operators";
import {Review} from "./review";
import {HttpEvent, HttpEventType} from "@angular/common/http";
import {Taster} from "../tasters/taster";

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

  deleteReview(review: Review): Observable<Review> {
    return this.mikeDb.delete<Review>("reviews", review);
  }

  uploadReviewPhoto(review: Review, value: FormData): Observable<HttpEvent<FormData>> {
    const id = MikeDbService.getRandomRange(1000);
    const key = 'review-' + id + '-photo';
    let observable = this.mikeDb.uploadFile(key, value);
    observable.subscribe(event => {
      if (event.type == HttpEventType.Response) {
        if(!review.images){
          review.images = [];
        }
        review.images.push(this.mikeDb.getHostApiUrl() + key);
        this.addUpdateReview(review)
          .subscribe(review => {
            return review;
          });
      }
    });

    return observable;
  }

  deleteReviewPhoto(review: Review, image: string) {
    // extract key from url
    let prefix = this.mikeDb.getHostApiUrl();
    if (!image.startsWith(prefix)) {
      throw 'Can not delete what we do not own: ' + image;
    }
    let key = image.substr(prefix.length);
    const indexOf = key.indexOf('?');
    if (indexOf > 0) {
      key = key.substr(0, indexOf);
    }

    const imgIndex =  review.images ? review.images.findIndex(img => img === image) : -1;
    if (imgIndex < 0) {
      throw 'This review does not have this image: ' + image;
    }

    const observable = this.mikeDb.delete(key, null);
    observable.subscribe(data => {
      if(review.images){
        review.images.splice(imgIndex, 1);
        this.addUpdateReview(review)
          .subscribe(review => {
            return review;
          });
      }
    });
    return observable;
  }
}
