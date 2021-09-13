import {Component} from '@angular/core';

@Component({
  selector: 'loading',
  template: `
    <div>
      <img
        width="60"
        height="60"
        alt="404"
        src="./assets/loading-buffering.gif"
      />
    </div>
  `,
  styles: [`img {
    vertical-align: middle;
    margin: 0.2em;
  }

  div {
    text-align: center;
  }
  `]
})
export class LoadingComponent {

  constructor() {
  }

}
