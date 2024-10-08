// Angular modules
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppRoutingModule} from './app-routing.module';
// app common components
import {NotFoundComponent} from "./components/not-found/not-found-component";
import {LoadingComponent} from "./components/loading-buffering/loading-component";
import {ListSorterComponent} from "./components/list-sorter/list-sorter-component";
// app views components
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {PlacesComponent} from './places/places.component';
import {PlaceComponent} from "./places/place/place.component";
import {PlacesSearchComponent} from "./places/search/places.search.component";
import {PlacesDetailsComponent} from "./places/details/places.details.component";
import {MapAddressLink} from "./components/map-address-link/map-address-link";
import {EventsComponent} from './events/events.component';
import {EventComponent} from "./events/event/event.component";
import {EventsDetailsComponent} from "./events/details/events.details.component";
import {EventPlacePickerComponent} from "./events/place-picker/event.place-picker.component";
import {ReviewComponent} from "./events/review/review.component";
import {ReviewDetailsComponent} from "./reviews/review.details.component";
import {InputRatingFormComponent} from "./reviews/rating/input-rating";
import {TastersComponent} from "./tasters/tasters.component";
import {TasterComponent} from "./tasters/taster/taster.component";
import {TastersDetailsComponent} from "./tasters/details/tasters.details.component";
import {LoginDialog} from "./tasters/login/login-dialog.component";
import {FileUploadComponent} from "./components/file-upload/file-upload.component";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ImageComponent} from "./components/image-viewer/image-viewer-dialog";
import {MessengerDialog} from "./tasters/messanger/messanger-dialog";
import {NgxTrimDirectiveModule} from "ngx-trim-directive";
import {DecimalPipe} from "@angular/common";
import {SeasonComponent} from './home/season/season.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlacesComponent,
    PlacesSearchComponent,
    PlacesDetailsComponent,
    PlaceComponent,
    MapAddressLink,
    EventsComponent,
    EventsDetailsComponent,
    EventComponent,
    EventPlacePickerComponent,
    NotFoundComponent,
    LoadingComponent,
    ListSorterComponent,
    ReviewComponent,
    ReviewDetailsComponent,
    InputRatingFormComponent,
    TastersComponent,
    TasterComponent,
    TastersDetailsComponent,
    LoginDialog,
    FileUploadComponent,
    ImageComponent,
    MessengerDialog,
    SeasonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NgbModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    NgxTrimDirectiveModule
  ],
  providers: [DecimalPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
