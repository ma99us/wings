import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {Review} from "../../reviews/review";
import {Taster} from "../../tasters/taster";

@Component({
  selector: 'review-li',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.less']
})
export class ReviewComponent implements OnChanges, OnInit {

  @Input() review!: Review;
  @Input() onSelect!: (review: Review) => void;
  @Input() reviewAuthor?: Taster | null;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }

  get reviewName() {
    let name = 'Anonymous';
    if(this.review && this.review.author_id){
      name = '' + this.review.author_id;
    }
    return this.reviewAuthor ? this.reviewAuthor.name : name;
  }
}
