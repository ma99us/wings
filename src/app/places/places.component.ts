import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Place} from "./place";
import {Event} from "../events/event"
import {PlacesService} from "./places.service";
import {ConfirmDialogService} from "../components/confirmation-dialog/confirmation-dialog.service";
import {EventsService} from "../events/events.service";
import {TastersService} from "../tasters/tasters.service";
import {AbstractTasterComponent} from "../components/abstract-components/abstract.taster.component";

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.less']
})
export class PlacesComponent extends AbstractTasterComponent implements OnInit {

  places!: Place[] | null;
  eventsPlaces!: Event[] | null;
  displayPlaces!: Place[] | null;
  searchText: string = '';
  sortBy: number = PlacesSortBy.Unsorted;

  constructor(private route: ActivatedRoute, private router: Router, private placesService: PlacesService,
              private eventsService: EventsService, private confirmation: ConfirmDialogService,
              tasterService: TastersService) {
    super(tasterService);
  }

  async ngOnInit(): Promise<any> {
    await this.getAllPlaces();
    await this.getAllEventsPlaces();
    this.onSearchChange();
  }

  getAllPlaces(): Promise<Place[]> {
    return new Promise<Place[]>((resolve, reject) => {
      this.placesService.getPlaces()
        .subscribe((data: Place[]) => {
          this.places = data;
          resolve(data);
        }, err => {
          this.places = null;
          reject(null);
        });
    });
  }

  getAllEventsPlaces(): Promise<Event[]>  {
    return new Promise<Event[]>((resolve, reject) => {
      this.eventsService.getEventsPlaces()
        .subscribe((data: Event[]) => {
          this.eventsPlaces = data;
          resolve(data);
        }, err => {
          this.eventsPlaces = null;
          reject(null);
        });
    });
  }

  getEventsForPlace(place: Place): Event[] | null {
    return (this.eventsPlaces && place) ? this.eventsPlaces.filter(event => {
      return event.place_id == place.id; // FIXME: '==' is intentional!
    }) : null;
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

  onPlaceEventClick = (event: Event): void => {
    const url: string = "/events/" + event.id;
    this.router.navigateByUrl(url);
  };

  trackByFn(index: number, item: Place) {
    return item.id  // or index
  }
}

export const PlacesSortBy = {
  Unsorted: 0,
  NameAsc: 1,
  NameDesc: 2,
  RatingAsc: 3,
  RatingDesc: 4
};
