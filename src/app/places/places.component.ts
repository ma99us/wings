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
  searchText: string = '';
  sortBy: number = PlacesSortBy.Unsorted;

  constructor(private route: ActivatedRoute, private router: Router, private placesService: PlacesService, private confirmation: ConfirmDialogService) {
  }

  ngOnInit(): void {
    this.getAllPlaces();
  }

  getAllPlaces(): void {
    this.placesService.getPlaces()
      .subscribe((data: Place[]) => {
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
    this.searchText = title;
    const filtered = this.places ? this.places.filter((place: Place) => {
      return place.title && place.title.toLowerCase().includes(this.searchText.toLowerCase());
    }) : [];

    // sort if needed
    if (this.sortBy == PlacesSortBy.RatingAsc || this.sortBy == PlacesSortBy.RatingDesc) {
      this.displayPlaces = filtered.sort((first: Place, second: Place) => {
        // sort by rating, higher - first
        if (first.adjustedRating > second.adjustedRating) {
          return this.sortBy === PlacesSortBy.RatingAsc ? 1 : -1;
        } else if (first.adjustedRating < second.adjustedRating) {
          return this.sortBy === PlacesSortBy.RatingAsc ? -1 : 1;
        } else {
          return 0;
        }
      });
    } else if (this.sortBy == PlacesSortBy.NameAsc || this.sortBy == PlacesSortBy.NameDesc) {
      this.displayPlaces = filtered.sort((first: Place, second: Place) => {
        if (first.title && second.title && this.sortBy == PlacesSortBy.NameAsc) {
          return first.title.localeCompare(second.title);
        } else if (first.title && second.title && this.sortBy == PlacesSortBy.NameDesc) {
          return -first.title.localeCompare(second.title);
        } else {
          return 0;
        }
      });
    } else {
      this.displayPlaces = filtered;
    }
  };

  newPlace() {
    const url: string = "/places/0";
    this.router.navigateByUrl(url);
  }

  onSortChanged = (field: string, asc: boolean): void => {
    if (field === "Name" && asc) {
      this.sortBy = PlacesSortBy.NameAsc;
    } else if (field === "Name" && !asc) {
      this.sortBy = PlacesSortBy.NameDesc;
    } else if (field === "Rating" && asc) {
      this.sortBy = PlacesSortBy.RatingAsc;
    } else if (field === "Rating" && !asc) {
      this.sortBy = PlacesSortBy.RatingDesc;
    } else {
      this.sortBy = PlacesSortBy.Unsorted;
    }

    this.onSearchChange(this.searchText);
  };
}

export const PlacesSortBy = {
  Unsorted: 0,
  NameAsc: 1,
  NameDesc: 2,
  RatingAsc: 3,
  RatingDesc: 4
};
