import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'not-found',
  template: `<h5>
    <span *ngIf="!small">OOPS! Nothing here.</span>
    <img
      height="100"
      alt="404"
      src="./assets/how-about-no.gif"
    />
    <span *ngIf="!small">...probably Carlo broke something!</span>
  </h5>`,
  styles: [`img {
    vertical-align: middle;
    margin: 0 0.2em;
  }

  h5 {
    padding: 0.5em;
    background-color: cornsilk;
    text-align: center;
  }
  `]
})
export class NotFoundComponent implements OnInit {

  @Input() small: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
