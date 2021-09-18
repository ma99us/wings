import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {Review} from "../../reviews/review";

@Component({
  selector: 'review-li',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.less']
})
export class ReviewComponent implements OnChanges, OnInit {

  @Input() review!: Review;
  @Input() onSelect!: (review: Review) => void;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
  }
}
