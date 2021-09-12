import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Place} from "./place";
import {PlacesService} from "./places.service";
import {ConfirmDialogService} from "../components/confirmation-dialog/confirmation-dialog.service";

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.less']
})
export class PlacesComponent implements OnInit {

  places!: Place[] | null;
  displayPlaces!: Place[] | null;

  constructor(private route: ActivatedRoute, private router: Router, private placesService: PlacesService, private confirmation: ConfirmDialogService) {
  }

  ngOnInit(): void {
    this.getAllPlaces();
  }

  getAllPlaces(): void {
    this.placesService.getPlaces()
      .subscribe((data: any) => {
        this.places = data;
        this.onSearchChange();
      }, err => {
        this.places = null;
        this.onSearchChange();
      });
  }

  onSelect = (place?: Place): void => {
    const url: string = "/places/" + (place ? place.id : '');
    this.router.navigateByUrl(url);
  };

  onSearchChange = (title: string = ''): void => {
    this.displayPlaces = this.places ? this.places.filter((place: Place) => {
      return place.title && place.title.toLowerCase().includes(title.toLowerCase());
    }) : [];
  };

  newPlace() {
    const url: string = "/places/0";
    this.router.navigateByUrl(url);
  }
}
