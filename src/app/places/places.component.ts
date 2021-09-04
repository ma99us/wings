import {Component, OnInit} from '@angular/core';
import {Place} from "./place";
import {PlacesService} from "./places.service";

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.less']
})
export class PlacesComponent implements OnInit {

  searchByTitle: string = '';
  selectedPlace?: Place;
  places: Place[] = [];
  displayPlaces: Place[] = [];
  submitted = false;

  constructor(private placesService: PlacesService) {
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

  onSelect(place: Place): void {
    this.selectedPlace = place;
    this.submitted = false;
  }

  onSearchChangeEvent(event: any){
    if (event && event.target && event.target.value) {
      this.onSearchChange(event.target.value);
    } else {
      this.onSearchChange();
    }
  }

  onSearchChange(title: string = ''){
    this.searchByTitle = title;
    this.displayPlaces = this.places.filter((place: Place) => {
      return place.title && place.title.toLowerCase().includes(this.searchByTitle.toLowerCase());
    });
  }

  onSubmit() {
    if (!this.selectedPlace) {
      return;
    }
    this.placesService.addUpdatePlace(this.selectedPlace)
      .subscribe((data: any) => {
        this.selectedPlace = data;
        this.submitted = true;
        this.getAllPlaces();
      });
  }

  newPlace() {
    this.selectedPlace = new Place();
    this.submitted = false;
  }

  deletePlace() {
    if (!this.selectedPlace || !this.selectedPlace.id) {
      this.selectedPlace = undefined;
      return;
    }
    this.placesService.deletePlace(this.selectedPlace)
      .subscribe((data: any) => {
        this.selectedPlace = undefined;
        this.submitted = true;
        this.getAllPlaces();
      });
  }
}
