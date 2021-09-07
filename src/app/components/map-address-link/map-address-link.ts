import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'map-address-link',
  template: `<a *ngIf="mapLink" href='http://maps.google.com/maps?q={{mapLink}}' target='_blank'>
    <address>
      <img
        width="40"
        height="40"
        alt="Google Map"
        src="./assets/google_maps_icon_40.png"
      />
    </address>
  </a>`,
  styles: [`img {
    margin-left: 0.5em;
  }
  `]
})
export class MapAddressLink implements OnChanges {
  @Input() address?: string;
  mapLink?: string;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.mapLink = this.address ? encodeURIComponent(this.address) : '';
  }
}
