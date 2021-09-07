import {Component, OnInit} from '@angular/core';
import {Place} from "./place";
import {PlacesService} from "./places.service";
import {ConfirmDialogService} from "../components/confirmation-dialog/confirmation-dialog.service";

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.less']
})
export class PlacesComponent implements OnInit {

  selectedPlace?: Place;
  places: Place[] = [];
  displayPlaces: Place[] = [];
  submitted = false;

  constructor(private placesService: PlacesService, private confirmation: ConfirmDialogService) {
  }

  ngOnInit(): void {
    this.getAllPlaces();
  }

  getAllPlaces(): void {
    this.placesService.getPlaces()
      .subscribe((data: any) => {
        this.places = data;
        this.onSearchChange();
      });
  }

  onSelect = (place?: Place): void => {
    this.selectedPlace = place;
    this.submitted = false;
  };

  onSearchChange = (title: string = ''): void => {
    this.displayPlaces = this.places.filter((place: Place) => {
      return place.title && place.title.toLowerCase().includes(title.toLowerCase());
    });
  };

  onSubmit = () : void => {
    if (!this.selectedPlace) {
      return;
    }
    this.placesService.addUpdatePlace(this.selectedPlace)
      .subscribe((data: any) => {
        this.selectedPlace = data;
        this.submitted = true;
        this.getAllPlaces();
      });
  };

  newPlace() {
    this.selectedPlace = new Place();
    this.submitted = false;
  }

  deletePlace = (): void => {
    if (!this.selectedPlace || !this.selectedPlace.id) {
      this.selectedPlace = undefined;
      return;
    }

    this.confirmation.openConfirmation("Are you sure?", "Do you want to delete \"" + this.selectedPlace.title + "\"?")
      .then(result => {
        if (result && this.selectedPlace && this.selectedPlace.id) {
          this.placesService.deletePlace(this.selectedPlace)
            .subscribe((data: any) => {
              this.selectedPlace = undefined;
              this.submitted = true;
              this.getAllPlaces();
            });
        }
      });
  };
}
