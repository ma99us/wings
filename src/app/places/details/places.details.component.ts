import {Component, Input, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Place} from "../place";
import {ConfirmDialogService} from "../../components/confirmation-dialog/confirmation-dialog.service";
import {PlacesService} from "../places.service";

@Component({
  selector: 'places-details',
  templateUrl: './places.details.component.html',
  styleUrls: ['./places.details.component.less']
})
export class PlacesDetailsComponent implements OnInit {

  selectedPlace!: Place | null;
  submitted = false;

  constructor(private route: ActivatedRoute, private router: Router, private placesService: PlacesService, private confirmation: ConfirmDialogService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id == 0) {
        this.selectedPlace = new Place();
      } else if (id) {
        this.placesService.getPlaceById(id).subscribe((data: any) => {
          this.selectedPlace = data;
        }, err => {
          this.selectedPlace = null;
        });
      }
    });
  }


  goBack() {
    const url: string = "/places";
    this.router.navigateByUrl(url);
  }

  onSubmit() : void {
    if (!this.selectedPlace) {
      return;
    }
    this.placesService.addUpdatePlace(this.selectedPlace)
      .subscribe((data: any) => {
        this.selectedPlace = data;
        this.submitted = true;
        // this.goBack();
      });
  }

  deletePlace(): void {
    if (!this.selectedPlace || !this.selectedPlace.id) {
      return;
    }

    this.confirmation.openConfirmation("Are you sure?", "Do you want to delete \"" + this.selectedPlace.title + "\"?")
      .then(result => {
        if (result && this.selectedPlace && this.selectedPlace.id) {
          this.placesService.deletePlace(this.selectedPlace)
            .subscribe((data: any) => {
              this.submitted = true;
              this.goBack();
            });
        }
      });
  }
}
